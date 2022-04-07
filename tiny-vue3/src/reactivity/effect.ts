import { extend } from "../shared/index"
class ReactiveEffect {
  private _fn: any
  deps = []
  active = true
  onStop?:() => void
  constructor(fn, public scheduler?) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    return this._fn()
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
}

const targetMap = new Map()
export function track(target, key) {
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
  if (!activeEffect) return
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

export function trigger(target, key) {
  let desMap = targetMap.get(target)
  let dep = desMap.get(key)
  for(const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

let activeEffect
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