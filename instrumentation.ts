const ONE_HOUR_MS = 60 * 60 * 1000;

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const globalAny = globalThis as typeof globalThis & {
    __giftPriceRefreshTimer?: NodeJS.Timeout;
  };
  if (globalAny.__giftPriceRefreshTimer) return;

  const { refreshAllGiftPrices } = await import("@/lib/refresh-gift-prices");

  const run = async () => {
    try {
      const result = await refreshAllGiftPrices();
      console.log(
        `[cron:refreshGiftPrices] total=${result.total} updated=${result.updated} failed=${result.failed}`
      );
    } catch (err) {
      console.error("[cron:refreshGiftPrices] erro:", err);
    }
  };

  globalAny.__giftPriceRefreshTimer = setInterval(run, ONE_HOUR_MS);

  setTimeout(run, 30_000);
}
