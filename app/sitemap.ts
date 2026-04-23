import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();
  return [
    { url: `${baseUrl}/`, lastModified: now, priority: 1 },
    { url: `${baseUrl}/charraia/nossa-historia`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/charraia/presentes`, lastModified: now, priority: 0.8 },
    { url: `${baseUrl}/casamento`, lastModified: now, priority: 0.5 },
    { url: `${baseUrl}/casamento/nossa-historia`, lastModified: now, priority: 0.5 },
    { url: `${baseUrl}/casamento/local`, lastModified: now, priority: 0.5 },
    { url: `${baseUrl}/casamento/rsvp`, lastModified: now, priority: 0.5 },
    { url: `${baseUrl}/casamento/presentes`, lastModified: now, priority: 0.5 },
  ];
}
