import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();
  return [
    { url: `${baseUrl}/`, lastModified: now, priority: 1 },
    { url: `${baseUrl}/nossa-historia`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/local`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/rsvp`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/presentes`, lastModified: now, priority: 0.8 },
  ];
}
