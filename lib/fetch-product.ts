import "server-only";

export type Product = {
  url: string;
  title: string | null;
  image: string | null;
  site: string;
};

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function ogTag(html: string, name: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']og:${name}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${name}["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+name=["']twitter:${name}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return decode(m[1]);
  }
  return null;
}

export async function fetchProduct(url: string): Promise<Product> {
  const site = new URL(url).hostname.replace(/^www\./, "");
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        Accept: "text/html",
      },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return { url, title: null, image: null, site };
    const html = (await res.text()).slice(0, 200_000);
    return {
      url,
      title: ogTag(html, "title"),
      image: ogTag(html, "image"),
      site,
    };
  } catch {
    return { url, title: null, image: null, site };
  }
}
