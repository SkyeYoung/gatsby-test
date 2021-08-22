---
title: "Markdown Style"
path: "/markdown-style"
date: 2021/8/18
---

测试基本的 Markdown 样式。

## Headings

# H1

实际使用时，文章中最高级别的标题应为 H2 。

## H2

### H3

#### H4

##### H5

###### H6

## Emphasis

*italic*，**bold**，~~deleted~~

## Links

### 站内链接

- [以 / 开头](/test/test-multi-level)
- [以 ./ 开头](./test/test-multi-level)
- [以 .md 结尾](test/test-multi-level.md)
- [以 / 开头, .md 结尾](/test/test-multi-level.md)
- [/test/../index.md](/test/../index.md)

### 站外链接

- [GitHub](http://github.com)
- [Google](//google.com)

## List

### Ordered

1. A
    1. A.A
    2. A.B
2. B
3. C

### UnOrdered

* A
    * A.A
        * A.A.A
        * A.A.B
    * A.B
* B
* C

## Code

行内代码`inline code`

```javascript
console.log('block code')
```

## Blockquote

> Stray birds of summer comes to my window to sing and fly away
>
>> 夏日的飞鸟歌唱着、掠过我窗前
>>
>
> And yellow leaves of ...

## Table

| Syntax    | Description |   Test Text |
| :---------- | :-----------: | ------------: |
| Headings    |    Title    | Here's this |
| Paragraph |    Text    |    And more |
