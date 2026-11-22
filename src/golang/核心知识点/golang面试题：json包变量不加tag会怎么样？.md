---
title: golang面试题：json包变量不加tag会怎么样？
date: 2020-05-18 22:57:55
tags:
categories: "golang面试题"
---

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9pbWdrci5jbi1iai51ZmlsZW9zLmNvbS81MWY1ZjQ0NS04YzczLTQ1YTYtOTcxOS02NjI2M2Q4NDY2MTYucG5n?x-oss-process=image/format,png)

<!-- more -->

# 问题

`json`包里使用的时候，结构体里的变量不加`tag`能不能正常转成`json`里的字段？

# 怎么答

- 如果变量`首字母小写`，则为`private`。无论如何`不能转`，因为取不到`反射信息`。
- 如果变量`首字母大写`，则为`public`。
  - `不加tag`，可以正常转为`json`里的字段，`json`内字段名跟结构体内字段`原名一致`。
  - `加了tag`，从`struct`转`json`的时候，`json`的字段名就是`tag`里的字段名，原字段名已经没用。

# 举例

通过一个例子加深理解。

```go
package main
import (
    "encoding/json"
    "fmt"
)
type J struct {
    a string             //小写无tag
    b string `json:"B"`  //小写+tag
    C string             //大写无tag
    D string `json:"DD"` //大写+tag
}
func main() {
    j := J {
      a: "1",
      b: "2",
      C: "3",
      D: "4",
    }
    fmt.Printf("转为json前j结构体的内容 = %+v\n", j)
    jsonInfo, _ := json.Marshal(j)
    fmt.Printf("转为json后的内容 = %+v\n", string(jsonInfo))
}
```

输出

```go
转为json前j结构体的内容 = {a:1 b:2 C:3 D:4}
转为json后的内容 = {"C":"3","DD":"4"}
```

# 解释

- 结构体里定义了四个字段，分别对应 `小写无tag`，`小写+tag`，`大写无tag`，`大写+tag`。
- 转为`json`后首字母`小写的`不管加不加 tag`都不能`转为`json`里的内容，而`大写的`加了`tag`可以`取别名`，不加`tag`则`json`内的字段跟结构体字段`原名一致`。

## 相关文章
- [golang进阶面试题八股文合集](/golang/面试题/2.Go进阶.md)

- [golang基础面试题八股文合集](/golang/面试题/1.Go入门.md)

- [golang常用标准库第三方库大全](/golang/常用包大全.md)

- [golang学习路线](/golang/学习路线.md)
