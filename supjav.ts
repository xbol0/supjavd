const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:106.0) Gecko/20100101 Firefox/106.0";

const Empty = new Response(null, { status: 404 });
const GroupMap = {
  category: "category/",
  maker: "category/maker/",
  cast: "category/cast/",
  tag: "tag/",
};

async function handler(req: Request) {
  const uri = new URL(req.url);
  let lang = uri.searchParams.get("lang") || "en";
  console.log(new Date().toISOString(), uri.pathname);

  if (req.method !== "GET") return Empty;
  if (lang !== "zh" && lang !== "en" && lang !== "ja") {
    lang = "en";
  }

  if (uri.pathname.match(/^\/\d+(\.m3u|\.html|\.m3u8)?$/)) {
    const id = uri.pathname.match(/\d+/)![0];
    const url = await getM3U8ById(id);
    if (url === null) return Empty;
    const urlobj = new URL(url);
    return new Response(null, {
      status: 307,
      headers: { location: `/${urlobj.hostname}${urlobj.pathname}` },
    });
  }

  if (uri.pathname.match(/^\/.*?\/stream\//)) {
    const i = uri.pathname.indexOf("/stream/");
    const cdnHost = uri.pathname.slice(1, i);
    const path = uri.pathname.slice(i);
    const u = new URL(path, `https://${cdnHost}`);
    const res = await fetch(u, { headers: { referer: u.origin } });
    return new Response(res.body, {
      headers: {
        "content-type": res.headers.get("content-type") ||
          "application/vnd.apple.mpegurl",
      },
    });
  }

  if (uri.pathname.match(/^\/popular\/(day|week|month)$/)) {
    const type = uri.pathname.split("/").pop();
    if (!type) return Empty;
    let p = "/";
    if (lang !== "en") p += lang + "/";
    const base = new URL(p + "popular", "https://supjav.com");
    base.searchParams.set("sort", type);
    const list = await getList(base);
    if (!list) return Empty;
    return new Response(makePlayList(list, uri.origin));
  }

  if (uri.pathname.startsWith("/search/")) {
    const param = uri.pathname.slice(8);
    let p = "/";
    if (lang !== "en") p += lang + "/";
    const base = new URL(p, "https://supjav.com");
    base.searchParams.set("s", param);
    const list = await getList(base);
    if (!list) return Empty;
    return new Response(makePlayList(list, uri.origin));
  }

  for (const [key, path] of Object.entries(GroupMap)) {
    if (!uri.pathname.startsWith(`/${key}/`)) continue;

    let p = "/";
    if (lang !== "en") p += lang + "/";
    const param = uri.pathname.slice(key.length + 2);
    const base = new URL(p + path + param, "https://supjav.com");
    const pages = parseInt(uri.searchParams.get("pages") || "3");
    const list = await getList(base, pages);
    if (!list) return Empty;
    return new Response(makePlayList(list, uri.origin));
  }

  return Empty;
}

export async function getM3U8ById(id: string) {
  const req1 = await fetch(`https://supjav.com/${id}.html`, {
    headers: {
      "referer": "https://supjav.com/",
      "user-agent": UA,
    },
  });
  const data1 = await req1.text();
  const linkList = data1.match(/data-link\=".*?">.*?</mg);
  if (!linkList) return null;
  const serverMap = makeServerList(linkList);

  const tvid = serverMap.TV.split("").reverse().join("");
  const data2 = await (await fetch(
    `https://lk1.supremejav.com/supjav.php?c=${tvid}`,
    {
      headers: {
        "referer": "https://supjav.com/",
        "user-agent": UA,
      },
    },
  )).text();

  const url = data2.match(/urlPlay.*?(https.*?\.m3u8)/m);
  if (url === null) return null;
  return url[1];
}

type MediaItem = {
  id: string;
  title: string;
  thumb: string;
};
export function extractMediaList(body: string): MediaItem[] | null {
  const list = body.match(
    /https:\/\/supjav\.com\/.*?\d+\.html.*?title=\".*?\".*?data-original=\".*?\"/gm,
  );
  if (!list) return null;
  return list.map((item) => {
    const id = item.match(/supjav\.com\/.*?(\d+)\.html/)![1];
    const title = item.match(/title=\"(.*?)\"/)![1];
    const thumb = item.match(/data-original=\"(.*?)\"/)![1].split("!")[0];
    return { id, title, thumb };
  });
}

async function fetchBody(url: string | URL) {
  const req = await fetch(url, { headers: { "user-agent": UA } });
  const body = await req.text();
  return body;
}

async function getList(base: URL, pages = 3) {
  console.log("BASE:", base.href);
  const arr = [fetchBody(base)];
  for (let i = 2; i <= pages; i++) {
    const u = new URL(base.href);
    if (!u.pathname.endsWith("/")) u.pathname += "/";
    u.pathname = u.pathname + "page/" + i;
    arr.push(fetchBody(u));
  }
  const list = await Promise.all(arr);
  return list.map(extractMediaList).filter((i) => !!i).flat() as MediaItem[];
}

function makePlayList(list: MediaItem[], host: string): string {
  let str = "#EXTM3U\n";
  for (const item of list) {
    str += '#EXTINF:-1 tvg-logo="' + item.thumb + '",' + item.title + "\n";
    str += host + "/" + item.id + ".m3u8\n";
  }
  return str;
}

function makeServerList(arr: RegExpMatchArray) {
  const result: Record<string, string> = {};
  for (const item of arr) {
    const i = item.indexOf(">");
    const key = item.slice(i + 1, -1);
    const val = item.slice(11, i - 1);
    result[key] = val;
  }
  return result;
}

export default { fetch: handler };
