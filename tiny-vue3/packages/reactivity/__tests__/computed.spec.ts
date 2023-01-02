import { computed } from "../src/computed"
import { reactive } from "../src/reactive"

describe('reactivity/computed', () => {
  it('happy path', () => {
    // ref
    // .value
    // 1. 缓存
    const user = reactive({
      age: 1
    })
    const age = computed(() => {
      return user.age
    })
    expect(age.value).toBe(1)
  })

  it('should compute lazily', () => {
    const value = reactive({
      foo: 1
    })
    const getter = jest.fn(() => {
      return value.foo
    })
    const cValue = computed(getter)

    // lazy
    expect(getter).not.toHaveBeenCalled()
    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute until needed
    value.foo = 2 // 触发trigger -> effect -> set 重新执行了
    expect(getter).toHaveBeenCalledTimes(1)

    // now it should compute
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  })
})