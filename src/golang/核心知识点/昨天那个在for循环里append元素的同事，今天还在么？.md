---
title: 昨天那个在for循环里append元素的同事，今天还在么？
date: 2020-09-12 22:57:55
tags:
categories: "golang面试题"
---

![](https://i.loli.net/2020/09/23/cPoMQsnbLIExiBZ.png)

<!-- more -->

# 问题

```go
package main

import "fmt"

func main() {
	s := []int{1,2,3,4,5}
	for _, v:=range s {
		s =append(s, v)
		fmt.Printf("len(s)=%v\n",len(s))
	}
}
```

**这个代码会造成死循环吗？**

# 怎么答

- **不会死循环**，`for range`其实是`golang`的`语法糖`，在循环开始前会获取切片的长度 `len(切片)`，然后再执行`len(切片)`次数的循环。

# 解释

- `for range`的源码是

```go
// The loop we generate:
//   for_temp := range
//   len_temp := len(for_temp)
//   for index_temp = 0; index_temp < len_temp; index_temp++ {
//           value_temp = for_temp[index_temp]
//           index = index_temp
//           value = value_temp
//           original body
//   }
```

- 上面的代码会被编译器认为是

```go
func main() {
	s := []int{1,2,3,4,5}
	for_temp := s
	len_temp := len(for_temp)
	for index_temp := 0; index_temp < len_temp; index_temp++ {
		value_temp := for_temp[index_temp]
		_ = index_temp
		value := value_temp
		// 以下是 original body
		s =append(s, value)
		fmt.Printf("len(s)=%v\n",len(s))
	}
}
```

- 代码运行输出

```go
len(s)=6
len(s)=7
len(s)=8
len(s)=9
len(s)=10
```

**所以说，那个同事用的是 golang 吗？**

# 文章推荐：
- [golang进阶面试题八股文合集](/golang/面试题/2.Go进阶.md)

- [golang基础面试题八股文合集](/golang/面试题/1.Go入门.md)

- [golang常用标准库第三方库大全](/golang/常用包大全.md)

- [golang学习路线](/golang/学习路线.md)
