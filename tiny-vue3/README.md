# toy-vue3
关于vue3核心源码的reactivity、runtime-core、runtime-dom、compiler-core等模块的mini版实现。

# Tasking(任务拆分)
  reactivity、runtime-core、runtime-dom、compiler-core
## reactivity

:white_check_mark: 支持 jest 环境搭建  
:white_check_mark: 支持 effect & reactive 依赖搜集 & 依赖触发  
:white_check_mark: 支持 effect.runner  
:white_check_mark: 支持 effect.scheduler  
:white_check_mark: 支持 effect.stop  
:white_check_mark: 支持 readonly  
:white_check_mark: 支持 isReactive、isReadonly  
:white_check_mark: 支持嵌套 reactive  
:white_check_mark: 支持 shallowReadonly  
:white_check_mark: 支持 isProxy   
:white_check_mark: 支持 toRaw  
:white_check_mark: 支持 ref  
:white_check_mark: 支持 isRef、unRef  
:white_check_mark: 支持 proxyRefs  
:white_check_mark: 支持 computed 计算属性  

## runtime-core

:white_check_mark: 初始化 Component  
:white_check_mark: 支持 rollup 打包  
:white_check_mark: 初始化 element 主流程  
:white_check_mark: 支持 组件代理对象  
:white_check_mark: 支持 shapeFlags  
:white_check_mark: 支持 注册事件功能  
:white_check_mark: 实现 组件 props 逻辑  
:white_check_mark: 实现 组件 emit 功能  
:white_check_mark: 支持 slots 功能  
:white_check_mark: 支持 Fragment 和 Text 类型节点  
:white_check_mark: 支持 getCurrentInstance  
:white_check_mark: 支持 provide/inject  

## runtime-dom

:white_check_mark: 实现自定义渲染器 custom/renderer  
:white_check_mark: 更新 element 流程搭建  
:white_check_mark: 更新 element props  
:white_check_mark: 更新 element children  
:white_check_mark: 实现 双端对比 diff 算法  
:white_check_mark: 实现 组件更新  
:white_check_mark: 支持 nextTick  

## compiler-core

:white_check_mark: 实现 解析插值功能  
:white_check_mark: 实现 解析 element 标签  
:white_check_mark: 实现 解析 text 功能  
:white_check_mark: 实现 解析三种联合类型  
:white_check_mark: 实现 parse&有限状态机  
:white_check_mark: 实现 transform  
:white_check_mark: 实现 代码生成 string 类型  
:white_check_mark: 实现 代码生成插值类型 cmproj  
:white_check_mark: 实现 代码生成三种联合类型  
:white_check_mark: 实现 编译 template 成 render 函数  

## main
:white_check_mark: 实现 monorepo 代码管理  
:white_check_mark: 测试框架更换，从 jest 升级为 vitest  

# 项目应用
## 项目初始化

```javascript
yarn install
```

## 项目动态打包
```javascript
yarn build:w
```

## 项目用例查看

打开 example 中的demo文件，用vscode的live-server可以启动查看。