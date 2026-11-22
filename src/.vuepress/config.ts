import { viteBundler } from "@vuepress/bundler-vite";
import { tocPlugin } from "@vuepress/plugin-toc";
import { defineUserConfig } from "vuepress";
import viteCompression from "vite-plugin-compression";
import theme from "./theme.js";

const base = "/golang-full-stack/";

export default defineUserConfig({
  base,
  lang: "zh-CN",
  title: "Golang全栈指南",
  description:
    "Golang全栈开发学习指南，涵盖Golang基础与源码、计算机基础、网络协议、操作系统、中间件与系统架构等核心知识。",
  bundler: viteBundler({
    viteOptions: {
      plugins: [
        viteCompression({ algorithm: "brotliCompress" }),
        viteCompression({ algorithm: "gzip" }),
      ],
    },
    vuePluginOptions: {},
  }),
  head: [
    ["link", { rel: "icon", type: "image/png", href: `${base}favicon.png` }],
    ["link", { rel: "shortcut icon", href: `${base}favicon.ico` }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "Golang, Go语言, 计算机基础, 网络基础, 操作系统, MySQL, Redis, Kafka, RocketMQ, ElasticSearch, 微服务, Kubernetes, Docker",
      },
    ],
    ["meta", { name: "theme-color", content: "#1755F4" }],
  ],
  plugins: [tocPlugin({})],
  theme,
  shouldPrefetch: false,
});
