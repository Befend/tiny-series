import { extend } from "../shared/index"


let activeEffect
let shouldTrack
export class ReactiveEffect {
  private _fn: any
  deps = []
  active = true
  onStop?:() => void
  constructor(fn, public scheduler?) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    // 1. 会收集依赖
    // shouldTrack 来做区分
    if (!this.active) {
      return this._fn()
    }
    shouldTrack = true
    activeEffect = this

    const result = this._fn()
    // reset 
    shouldTrack = false
    return result
  }
  stop() {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  });
  effect.deps.length = 0
}

const targetMap = new Map()
export function track(target, key) {
  // 判断是否处于收集状态
  if (!isTracking()) return

  // target -> key -> dep
  let desMap = targetMap.get(target)
  if (!desMap) {
    desMap = new Map()
    targetMap.set(target, desMap)
  }

  let dep = desMap.get(key)
  if(!dep) {
    dep = new Set()
    desMap.set(key, dep)
  }

  trackEffects(dep)
}

export function trackEffects(dep) {
  // 看看dep之前有没有添加过，添加过就不添加了
  if (dep.has(activeEffect)) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export function trigger(target, key) {
  let desMap = targetMap.get(target)
  let dep = desMap.get(key)
  triggerEffects(dep)
}

export function triggerEffects(dep) {
  for(const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export function effect(fn, options:any = {}) {
  // fn
  const _effect = new ReactiveEffect(fn, options.scheduler)

  extend(_effect, options)

  _effect.run()

  const runner:any = _effect.run.bind(_effect)
  runner.effect = _effect
  
  return runner
}

export function stop(runner) {
  runner.effect.stop()
}