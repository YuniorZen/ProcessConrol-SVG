## ProcessControl-SVG

> 可拖拽的营销流程配置前端模块，自动进行营销转化。


``` bash

基于webpack+vuer技术栈构建和开发前端项目，自主开发可拖拽的流程控制节点，节点的碰撞检测和上下级关联及数据的绑定，实现节点的编辑保存和回选数据，使用snapsvg库对svg对象进行操作修改等。这里简化目录只展示流程节点的拖拽链接以及节点的编辑。

***NodeEditor.vue 节点的编辑界面基于element-ui搭建，可自行实现。
ProcessSVG.js 流程的初始化和拖拽逻辑实现仅提供学习参考，可自行修改复用于项目中。


```

## Build Setup

``` bash
# 1. git clone到本地开发目录
git clone https://github.com/YuniorZen/ProcessConrol-SVG.git

# 2. 安装node环境，运行安装项目依赖
npm install

# 3. 运行开发环境，本地服务localhost:8080
npm run dev
```

#催付款营销流程图示
![催付款营销流程](https://raw.githubusercontent.com/YuniorZen/ProcessConrol-SVG/master/demo/process-demo.png)
