import { hasChanged, isObject } from "../shared"
import { reactive } from "./reactive"
import { isTracking, trackEffects, triggerEffects } from "./effect"

class RefImpl {
  private _value: any
  public dep
  private _rawValue: any
  public __v_isRef = true
  constructor(value) {
    this._rawValue = value
    this._value = convert(value)
    // value -> reactive
    // 1. 看看value是不是对象
    this.dep = new Set()
  }
  get value() {
    trackRefValue(this)
    return this._value
  }
  set value(newValue) {
    // 判断新旧值是否相等，相等返回
    // 不相等，修改旧值
    // newValue -> this._value
    if (hasChanged(this._value, newValue)) {
      this._rawValue = newValue
      this._value = convert(newValue)
      triggerEffects(this.dep)
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value
}

export function trackRefValue(ref) {
  if(isTracking()) {
    trackEffects(ref.dep)
  }
}

export function ref(value) {
  return new RefImpl(value)
}

export function isRef(ref) {
  return !!ref.__v_isRef
}

export function unRef(ref) {
  // 判断是否 ref -> ref.value
  return isRef(ref) ? ref.value : ref
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
       // get -> age
      //      ref -> 那么给他返回.value
      //  not ref -> value
      return unRef(Reflect.get(target, key))
    },
    set(target, key, value) {
      // set -> ref   .value
      if (isRef(target[key]) && !isRef(value)) {
        return target[key].value = value
      } else {
        return Reflect.set(target, key, value)
      }
    }
  })
}