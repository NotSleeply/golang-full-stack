import { defineClientConfig } from "vuepress/client";
import { defineSearchConfig } from "vuepress-plugin-search-pro/client";

// 多词和中文按 AND 匹配，避免只命中单个汉字导致结果过多
defineSearchConfig({
  combineWith: "and",
});

export default defineClientConfig({});
