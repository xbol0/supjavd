# supjavd

[Supjavd](https://supjav.com/) m3u8 playlist proxy. Use for IPTV/m3u8 player.

## Features

- Support [Cloudflare Workers](https://workers.cloudflare.com/)
- Developed by [Deno](https://deno.land/)
- Support category, search and tag filter
- Support language switch and custom pages

## Router Usage

Demo: https://supjavd.orzv.workers.dev/

### Master playlist

In the detail page, eg: `https://supjav.com/187772.html`

Replace the domain to your instance: `https://supjavd.orzv.workers.dev/187772.html`

Or use the id, these following allowed:

```
https://supjavd.orzv.workers.dev/187772
https://supjavd.orzv.workers.dev/187772.m3u
https://supjavd.orzv.workers.dev/187772.m3u8
```

### Category playlist

#### Global parameters

- `lang` specific language, values in en, zh, ja, defaults en
- `pages` how many pages will fetch, defaults 3, not allowed in popular pages

eg. `https://supjavd.orzv.workers.dev/category/uncensored-jav?lang=zh&pages=5`

#### Polupar list

`https://example.com/popular/day`
`https://example.com/popular/week`
`https://example.com/popular/month`

#### Category

`https://example.com/category/censored-jav`
`https://example.com/category/amateur`

#### Filter by maker

`https://example.com/maker/1pondo`

#### Filter by cast

`https://example.com/cast/fukada-eimi`

#### Filter by tag

`https://example.com/tag/doll`

#### Search by keyword

`https://example.com/search/dance`

## For developer

Launch with Deno:

```
deno run -A deno.ts
```

If you get SSL error, use this:

```
deno run -A --unsafely-ignore-certificate-errors deno.ts
```

Bundle for cloudflare workers:

```
deno bundle supjavd.ts bundle.js
```

