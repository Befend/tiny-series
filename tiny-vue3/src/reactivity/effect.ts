
class ReactiveEffect {
  private _fn: any

  constructor(fn, public scheduler?) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    return this._fn()
  }
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
    dep = new Set();
    desMap.set(key, dep)
  }
  dep.add(activeEffect)
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

  _effect.run()

  const runner = _effect.run.bind(_effect)
  
  return runner
} 