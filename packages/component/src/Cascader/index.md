---
title: 单选级联 - Cascader
nav:
  title: 组件
  path: /component
  order: 1
group:
  title: Bl
  path: /Bl
---

# Cascader

单选级联选择框

### 何时使用

- 需要从一组相关联的数据集合进行选择，例如省市区，公司层级，事物分类等。

- 从一个较大的数据集合中进行选择时，用多级分类进行分隔，方便选择。

- 比起 Select 组件，可以在同一个浮层中完成选择，有较好的体验。

### 基本使用

- [请参考 Antd](https://ant.design/components/cascader-cn/#API)
- 该组件默认输入、输出都是全路径数据结构

```
  value:(string | number)[] = ['zhejiang1', 'hangzhou1', 'xihu1']
```

- 树结构为

```typescript
  options: CascaderOptionType[] = [
    {
      value: 'zhejiang1',
      label: 'Zhejiang',
      children: [
        {
          value: 'hangzhou1',
          label: 'Hangzhou',
          children: [
            {
              value: 'xihu1',
              label: 'West Lake',
            },
            {
              value: 'xiasha1',
              label: 'Xia Sha',
              disabled: true,
            },
          ],
        },
      ],
    },
  ]
```

### 是否只显示叶子节点的 label

输入框的回显，默认显示全路径

#### 代码演示

<code src="./demo/demo1/index.tsx"></code>

### 自定义显示

自定义分隔符，默认用 `/` 分割

#### 代码演示

<code src="./demo/demo2/index.tsx"></code>

### 是否只能选择叶子节点

默认为 true，只能选择到最后一级的节点。

<code src="./demo/demo3/index.tsx"></code>

### 异步加载

> 注意：loadData 与 showSearch 无法一起使用。
> loadData 默认值显示问题

### 与 Form 表单一起使用

#### 代码演示

<API />
