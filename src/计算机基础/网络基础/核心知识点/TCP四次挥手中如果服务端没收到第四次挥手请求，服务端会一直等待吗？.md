---
title: TCP四次挥手中如果服务端没收到第四次挥手请求，服务端会一直等待吗？
date: 2022-08-13 22:57:55
tags:
categories: "图解网络"
---


搬运一个在某乎的回答，水一篇文章吧。

![](https://cdn.xiaobaidebug.top/image-20220813113924022.png)

![TCP四次挥手](https://cdn.xiaobaidebug.top/TCP%E5%9B%9B%E6%AC%A1%E6%8C%A5%E6%89%8B7.png)

正常情况下。只要数据传输完了，**不管是客户端还是[服务端](https://www.zhihu.com/search?q=服务端&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2613763971})，都可以主动发起四次挥手**，释放连接。

就跟上图画的一样，假设，这次四次挥手是由客户端主动发起的，那它就是**主动方**。服务器是被动接收客户端的挥手请求的，叫**被动方**。

客户端和服务器，一开始，都是处于`ESTABLISHED`状态。

**第一次挥手**：一般情况下，主动方执行`close()`或 `shutdown()`方法，会发个`FIN报文`出来，表示"**我不再发送数据了**"。

**第二次挥手**：在收到主动方的`FIN`报文后，被动方立马回应一个`ACK`，意思是"我收到你的 FIN 了，也知道你不再发数据了"。

上面提到的是**主动方**不再发送数据了。但如果这时候，**被动方**还有数据要发，那就继续发。注意，虽然第二次和第三次挥手之间，被动方是能发数据到主动方的，但主动方能不能正常收就不一定了，这个待会说。

**第三次挥手**：在被动方在感知到第二次挥手之后，会做了一系列的收尾工作，最后也调用一个 `close()`, 这时候就会发出第三次挥手的 `FIN-ACK`。

**第四次挥手**：主动方回一个`ACK`，意思是收到了。

其中第一次挥手和第三次挥手，都是我们在应用程序中主动触发的（比如调用`close()`方法），也就是我们平时写代码需要关注的地方。

第二和第四次挥手，都是内核协议栈自动帮我们完成的，我们写代码的时候碰不到这地方，因此也不需要太关心。

另外不管是主动还是被动，每方发出了一个 `FIN` 和一个`ACK` 。也收到了一个 `FIN` 和一个`ACK` 。

回到题主的问题。

**TCP 四次挥手中如果服务端没收到第四次挥手请求，服务端会一直等待吗？**

第四次挥手是第三次挥手触发的。如果第四次挥手服务端一直没收到，那服务端会认为是不是自己的第三次挥手丢了，于是服务端不断重试发第三次挥手（FIN）.重发次数由系统的 tcp_orphan_retries 参数控制。重试多次还没成功，服务端直接断开链接。**所以结论是服务端不会一直等待第四次挥手。**

![TCP第四次挥手丢失](https://cdn.xiaobaidebug.top/TCP%E7%AC%AC%E5%9B%9B%E6%AC%A1%E6%8C%A5%E6%89%8B%E4%B8%A2%E5%A4%B1.drawio.png)

```shell
# cat /proc/sys/net/ipv4/tcp_orphan_retries
0
```

另外，你会发现`tcp_orphan_retries`参数是 0，但其实并不是不重试的意思。为 0 时，默认值为 8. 也就是重试 8 次。

```c
/* Calculate maximal number or retries on an orphaned socket. */
static int tcp_orphan_retries(struct sock *sk, int alive)
{
	int retries = sysctl_tcp_orphan_retries; /* May be zero. */

	/* We know from an ICMP that something is wrong. */
	if (sk->sk_err_soft && !alive)
		retries = 0;

	/* However, if socket sent something recently, select some safe
	 * number of retries. 8 corresponds to >100 seconds with minimal
	 * RTO of 200msec. */
	if (retries == 0 && alive)
		retries = 8;
	return retries;
}
```

当然如果服务端重试发第三次挥手 FIN 的过程中，还是同样的端口和 IP,起了个新的客户端，这时候服务端重试的 FIN 被收到后，客户端就会认为是不正常的数据包，直接发个 RST 给服务端，这时候两端连接也会断开。

<br>

## 参考资料

查资料的时候发现**小林大佬已经写过，而且写的巨好**，感兴趣的可以看下他的这篇文章。

**《 如何优化 TCP?》**https://xiaolincoding.com/network/3_tcp/tcp_optimize.html#%E4%B8%BB%E5%8A%A8%E6%96%B9%E7%9A%84%E4%BC%98%E5%8C%96


<br>

<br>
<br>


## 文章推荐：

- [既然有 HTTP 协议，为什么还要有 RPC](/计算机基础/网络基础/核心知识点/既然有HTTP协议，为什么还要有RPC协议？.md)
- [TCP 粘包 数据包：我只是犯了每个数据包都会犯的错 |硬核图解](/计算机基础/网络基础/核心知识点/TCP粘包！数据包：我只是犯了每个数据包都会犯的错，硬核图解.md)
- [动图图解！既然 IP 层会分片，为什么 TCP 层也还要分段？](/计算机基础/网络基础/核心知识点/动图图解！既然IP层会分片，为什么TCP层也还要分段？.md)
