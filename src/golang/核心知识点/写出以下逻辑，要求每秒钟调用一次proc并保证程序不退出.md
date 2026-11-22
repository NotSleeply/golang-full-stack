# 写出以下逻辑，要求每秒钟调用一次proc并保证程序不退出?

```go
package main

func main() {
    go func() {
        // 1 在这里需要你写算法
        // 2 要求每秒钟调用一次proc函数
        // 3 要求程序不能退出
    }()

    select {}
}

func proc() {
    panic("ok")
}
```

**解析**

题目主要考察了两个知识点：

1. 定时执行执行任务
2. 捕获 panic 错误

题目中要求每秒钟执行一次，首先想到的就是 `time.Ticker`对象，该函数可每秒钟往`chan`中放一个`Time`,正好符合我们的要求。

在 `golang` 中捕获 `panic` 一般会用到 `recover()` 函数。  

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	go func() {
		// 1 在这里需要你写算法
		// 2 要求每秒钟调用一次proc函数
		// 3 要求程序不能退出

		t := time.NewTicker(time.Second * 1)
		for {
			select {
			case <-t.C:
				go func() {
					defer func() {
						if err := recover(); err != nil {
							fmt.Println(err)
						}
					}()
					proc()
				}()
			}
		}
	}()

	select {}
}

func proc() {
	panic("ok")
}

```


## 相关文章
- [golang进阶面试题八股文合集](/golang/面试题/2.Go进阶.md)

- [golang基础面试题八股文合集](/golang/面试题/1.Go入门.md)

- [golang常用标准库第三方库大全](/golang/常用包大全.md)

- [golang学习路线](/golang/学习路线.md)
