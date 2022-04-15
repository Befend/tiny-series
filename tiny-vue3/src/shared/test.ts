const ShapeFlags = {
  element: 0,
  stateful_component: 0,
  text_children: 0,
  array_children: 0
}

// vnode -> stateful_component -> 
// key-value(不够高效)
// 1. 可以设置 修改
// ShapeFlags.stateful_component = 1;
// ShapeFlags.array_children = 1


// if (ShapeFlags.element)
// if (ShapeFlags.stateful_component)

// 不够高效 -> 位运算的方式
// | 两位都为0， 才为0
// & 两位都为1， 才为1

// 0000
// 0001 -> element
// 0010 -> stateful
// 0100 -> text_children
// 1000 -> array_children

// 修改
// 0000 |
// 0001
// ————
// 0001

// 查找
// 0001 &
// 0001
// ————
// 0001

// 0010
// 0001
// ————
// 0000
