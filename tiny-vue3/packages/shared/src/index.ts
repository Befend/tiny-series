export * from "./toDisplayString";

export const extend = Object.assign

export const EMPTY_OBJ = {}

export const isObject = (value) => {
  return value !== null && typeof value === "object"
}

export const isString = (value) => {
  return typeof value === "string"
}

export const hasChanged = (oldValue, newValue) => {
  return !Object.is(oldValue, newValue)
}

export const hasOwn = (val, key) => {
  return Object.prototype.hasOwnProperty.call(val, key)
}

export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c:string) => {
    return c ? c.toUpperCase() : ""
  })
}

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const toHandlerKey = (str: string) => {
  return str ? `on${capitalize(str)}` : ""
}

export { ShapeFlags } from "./ShapeFlags";