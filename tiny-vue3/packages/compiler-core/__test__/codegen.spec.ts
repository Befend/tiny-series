import { baseParse } from "../src/parse"
import { generate } from "../src/codegen";
import { transform } from "../src/transform"
import { transformExpression } from "../src/transforms/transformExpression";
import { transformText } from "../src/transforms/transformText";
import { transformElement } from "../src/transforms/transformElement";

describe("codegen", () => {
  it("string", () => {
    const ast = baseParse("hi")
    transform(ast)
    const { code } = generate(ast)

    // 快照测试
    expect(code).toMatchSnapshot()
  })

  it("interpolation", () => {
    const ast = baseParse("{{message}}");
    transform(ast, {
      nodeTransforms: [transformExpression],
    })
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })

  it("element", () => {
    const ast: any = baseParse("<div>hi,{{message}}</div>")
    transform(ast, {
      nodeTransforms: [transformExpression, transformText, transformElement]
    })

    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })
})