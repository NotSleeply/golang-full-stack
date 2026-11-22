---
title: 连nil切片和空切片一不一样都不清楚？那BAT面试官只好让你回去等通知了。
date: 2020-10-12 22:57:55
tags:
categories: "golang面试题"
---

![封面nil切片和空切片的区别](https://cdn.xiaobaidebug.top/1715521271870.webp)
<!-- more -->

# 问题

```go
package main

import (
	"fmt"
	"reflect"
	"unsafe"
)

func main() {

	var s1 []int   // nil切片
	s2 := make([]int,0)  // 空切片
	s4 := make([]int,0)   // 空切片

	fmt.Printf("s1 pointer:%+v, s2 pointer:%+v, s4 pointer:%+v, \n", *(*reflect.SliceHeader)(unsafe.Pointer(&s1)),*(*reflect.SliceHeader)(unsafe.Pointer(&s2)),*(*reflect.SliceHeader)(unsafe.Pointer(&s4)))
	fmt.Printf("%v\n", (*(*reflect.SliceHeader)(unsafe.Pointer(&s1))).Data==(*(*reflect.SliceHeader)(unsafe.Pointer(&s2))).Data)
	fmt.Printf("%v\n", (*(*reflect.SliceHeader)(unsafe.Pointer(&s2))).Data==(*(*reflect.SliceHeader)(unsafe.Pointer(&s4))).Data)
}
```

**nil 切片和空切片指向的地址一样吗？这个代码会输出什么？**

# 怎么答

- **nil 切片和空切片指向的地址不一样。nil 空切片引用数组指针地址为 0（无指向任何实际地址）**
- **空切片的引用数组指针地址是有的，且固定为一个值**

```
s1 pointer:{Data:0 Len:0 Cap:0}, s2 pointer:{Data:824634207952 Len:0 Cap:0}, s4 pointer:{Data:824634207952 Len:0 Cap:0},
false //nil切片和空切片指向的数组地址不一样
true  //两个空切片指向的数组地址是一样的，都是824634207952
```

# 解释

- 之前在[前面的文章](https://zhuanlan.zhihu.com/p/144923309)里提到过切片的数据结构为

```go
type SliceHeader struct {
 Data uintptr  //引用数组指针地址
 Len  int     // 切片的目前使用长度
 Cap  int     // 切片的容量
}
```

- nil 切片和空切片最大的区别在于**指向的数组引用地址是不一样的**。
![](https://cdn.xiaobaidebug.top/1715521303529.webp)


- **所有的空切片指向的数组引用地址都是一样的**
  ![](https://cdn.xiaobaidebug.top/1720707170771.png)

# 文章推荐：
- [golang进阶面试题八股文合集](/golang/面试题/2.Go进阶.md)

- [golang基础面试题八股文合集](/golang/面试题/1.Go入门.md)

- [golang常用标准库第三方库大全](/golang/常用包大全.md)

- [golang学习路线](/golang/学习路线.md)
