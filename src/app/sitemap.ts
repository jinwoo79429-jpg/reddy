import { MetadataRoute } from 'next'

export const revalidate = 86400

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.reddybooklive.site'
  const lastModified = new Date('2026-05-14')

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/home`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
