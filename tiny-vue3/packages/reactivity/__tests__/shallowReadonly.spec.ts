import { isReadonly, shallowReadonly } from '../src/reactive'
import { vi } from 'vitest'

describe("shallowReadonly", () => {
  test("should not make non-reactive properties reactive", () => {
    const props = shallowReadonly({ n: { foo: 1} })
    expect(isReadonly(props)).toBe(true)
    expect(isReadonly(props.n)).toBe(true)
  })
  it("should call console.warn when set", () => {
    // console.warn()
    // mock
    console.warn = vi.fn()

    const user = shallowReadonly({
      age: 10
    })

    user.age = 11
    expect(console.warn).toHaveBeenCalled()
  })
})