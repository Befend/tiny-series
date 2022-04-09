import { track, trigger } from "./effect"
import { reactive, readonly, ReactiveFlags } from "./reactive"
import { isObject } from "../shared/index"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
function createGetter(isReadonly = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    const res = Reflect.get(target, key)

    // 看看res是不是object
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    if (!isReadonly) {
      // 依赖收集
      track(target, key)
    }
    return res
  }
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value)

    // 触发依赖
    trigger(target, key)
    return res
  }
}

export const mutableHandler = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key: ${key} set 失败，因为 target 是 readonly`, target)
    return true
  }
}