# supjavd

[Supjavd](https://supjav.com/) m3u8 播放列表代理工具，适用于IPTV/m3u8播放器。

## 特性

- 支持 [Cloudflare Workers](https://workers.cloudflare.com/)
- 使用 [Deno](https://deno.land/) 开发
- 支持分类、搜索和标签
- 支持语言切换和自定义页数

## 使用方法

示例地址: https://supjavd.orzv.workers.dev/

*免费资源有限，请合理使用，有动手能力的建议自行部署*

### 主播放列表

在播放详情页, 比如: `https://supjav.com/187772.html`

替换域名为你的服务器域名: `https://supjavd.orzv.workers.dev/187772.html`

或者使用ID，这些格式都支持:

```
https://supjavd.orzv.workers.dev/187772
https://supjavd.orzv.workers.dev/187772.m3u
https://supjavd.orzv.workers.dev/187772.m3u8
```

### 分组播放列表

#### 全局参数

- `lang` 指定语言, 可选 en, zh, ja, 默认 en
- `pages` 获取多少页的列表, 默认 3, 热门列表不支持这个参数

eg. `https://supjavd.orzv.workers.dev/category/uncensored-jav?lang=zh&pages=5`

#### 热门列表

> https://supjav.com/popular

`https://example.com/popular/day`
`https://example.com/popular/week`
`https://example.com/popular/month`

#### 分类

> https://supjav.com/category/uncensored-jav

`https://example.com/category/censored-jav`
`https://example.com/category/amateur`

#### 制作方

> https://supjav.com/maker

`https://example.com/maker/1pondo`

#### 演员

> https://supjav.com/cast

`https://example.com/cast/fukada-eimi`

#### 标签

> https://supjav.com/tag

`https://example.com/tag/doll`

#### 关键字搜索

> https://supjav.com/?s=eimi

`https://example.com/search/dance`

## 开发者说明

使用Deno启动:

```
deno run -A deno.ts
```

如果使用中发现SSL证书错误，使用这个方法启动:

*目前也是由于这个原因无法部署到Deno Deploy*

```
deno run -A --unsafely-ignore-certificate-errors deno.ts
```

打包到Cloudflare workers:

```
deno bundle supjavd.ts bundle.js
```

