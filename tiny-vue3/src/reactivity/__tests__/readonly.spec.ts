import { readonly } from '../reactive'
describe('readonly', () => {
  it("happy path", () => {
    // no set
    const original = { foo: 1, bar: { baz: 2 } }
    const observed = readonly(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)
  })

  it("warn then call set", () => {
    // console.warn()
    // mock
    console.warn = jest.fn()

    const user = readonly({
      age: 10
    })

    user.age = 11
    expect(console.warn).toBeCalled()
  })
})