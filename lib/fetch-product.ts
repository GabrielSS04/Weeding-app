import "server-only";

export type Product = {
  url: string;
  title: string | null;
  image: string | null;
  price: string | null;
  site: string;
};

function decode(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function meta(html: string, keyAttr: string, keyValue: string): string | null {
  const escaped = keyValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta[^>]+${keyAttr}=["']${escaped}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+${keyAttr}=["']${escaped}["']`,
      "i"
    ),
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m) return decode(m[1].trim());
  }
  return null;
}

function titleTag(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? decode(m[1].trim()) : null;
}

function formatPrice(amount: string | null, currency: string | null): string | null {
  if (!amount) return null;
  const n = Number(amount);
  if (!Number.isFinite(n)) return null;
  const cur = currency ?? "BRL";
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: cur,
    }).format(n);
  } catch {
    return `${cur} ${amount}`;
  }
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
    if (!res.ok) return { url, title: null, image: null, price: null, site };
    const html = (await res.text()).slice(0, 1_000_000);

    const title =
      meta(html, "property", "og:title") ??
      meta(html, "name", "twitter:title") ??
      meta(html, "name", "title") ??
      meta(html, "itemprop", "name") ??
      titleTag(html);

    const image =
      meta(html, "property", "og:image") ??
      meta(html, "name", "twitter:image") ??
      meta(html, "itemprop", "image");

    let priceAmount =
      meta(html, "property", "product:price:amount") ??
      meta(html, "property", "og:price:amount") ??
      meta(html, "itemprop", "price");

    let priceCurrency =
      meta(html, "property", "product:price:currency") ??
      meta(html, "property", "og:price:currency") ??
      meta(html, "itemprop", "priceCurrency");

    if (!priceAmount) {
      const jsonMatch = html.match(
        /"price"\s*:\s*(\d+(?:\.\d+)?)[^{}]*?"currency"\s*:\s*"([A-Z]{3})"/
      );
      if (jsonMatch) {
        priceAmount = jsonMatch[1];
        priceCurrency = priceCurrency ?? jsonMatch[2];
      }
    }

    return {
      url,
      title,
      image,
      price: formatPrice(priceAmount, priceCurrency),
      site,
    };
  } catch {
    return { url, title: null, image: null, price: null, site };
  }
}
