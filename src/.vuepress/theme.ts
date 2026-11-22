import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

// 复用原生中文分词器，避免引入 native addon 并兼容纯前端全文搜索
const zhSegmenter = new Intl.Segmenter("zh-CN", { granularity: "word" });

export default hopeTheme({
  hostname: "https://notsleeply.github.io",

  iconAssets: "fontawesome-with-brands",

  logo: "/new_logo.png",

  repoDisplay: false,
  editLink: false,
  contributors: false,
  lastUpdated: false,
  copyright: false,
  displayFooter: false,
  pageInfo: ["Category", "Tag", "ReadingTime"],

  navbar,
  sidebar,

  plugins: {
    searchPro: {
      indexContent: true,
      autoSuggestions: true,
      indexOptions: {
        tokenize: (text) => {
          const tokens: string[] = [];
          for (const { segment, isWordLike } of zhSegmenter.segment(text)) {
            if (!isWordLike) continue;
            const trimmed = segment.trim();
            if (!trimmed) continue;
            if (/[\u4e00-\u9fa5]/.test(trimmed)) {
              if (trimmed.length > 1) tokens.push(trimmed);
              for (const ch of trimmed) {
                if (/[\u4e00-\u9fa5]/.test(ch)) tokens.push(ch);
              }
            } else {
              tokens.push(trimmed.toLowerCase());
            }
          }
          return tokens;
        },
      },
    },

    mdEnhance: {
      align: true,
      attrs: true,
      codetabs: true,
      demo: true,
      figure: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ["ts", "vue"],
      },
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true,
    },

    components: {
      components: ["Badge"],
    },

    seo: {
      autoDescription: true,
    },

    sitemap: {
      changefreq: "weekly",
    },

    pwa: {
      favicon: "/favicon.ico",
      cacheHTML: false,
      cachePic: true,
      appendBase: true,
      apple: {
        icon: "/assets/icon/apple-icon-152.png",
        statusBarColor: "black",
      },
      msTile: {
        image: "/assets/icon/ms-icon-144.png",
        color: "#ffffff",
      },
      manifest: {
        icons: [
          {
            src: "/assets/icon/chrome-mask-512.png",
            sizes: "512x512",
            purpose: "maskable",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-mask-192.png",
            sizes: "192x192",
            purpose: "maskable",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-192.png",
            sizes: "192x192",
            purpose: "any",
            type: "image/png",
          },
        ],
        shortcuts: [
          {
            name: "首页",
            short_name: "首页",
            url: "/",
            icons: [
              {
                src: "/assets/icon/guide-maskable.png",
                sizes: "192x192",
                purpose: "maskable",
                type: "image/png",
              },
            ],
          },
        ],
      },
    },
  },
});
