import { mutableHandler, readonlyHandlers } from "./baseHandlers"



export function reactive(raw) {
  return createActiveObject(raw, mutableHandler)
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}

function createActiveObject(raw:any, baseHandlers) {
  return new Proxy(raw, baseHandlers)
}