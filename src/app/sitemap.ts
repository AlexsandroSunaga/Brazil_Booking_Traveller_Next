import { AIRPORTS, DESTINATIONS, SITE } from "@/lib/constants";

export default function sitemap() {
  const baseUrl = SITE.url;

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/book`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/fleet`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  const airportPages = AIRPORTS.map((a) => ({
    url: `${baseUrl}/locations/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const locationPages = DESTINATIONS.map((l) => ({
    url: `${baseUrl}/locations/${l.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...airportPages, ...locationPages];
}
