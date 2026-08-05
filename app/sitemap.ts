import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://swordsman.vn'
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gioi-thieu`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vi-da-cao-cap`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/that-lung-da`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bo-qua-tang`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/phu-kien-da`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tin-tuc`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  let productRoutes: MetadataRoute.Sitemap = []
  let postRoutes: MetadataRoute.Sitemap = []

  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder-url')) {
    try {
      const client = createClient(supabaseUrl, supabaseAnonKey)
      
      // Fetch products
      const { data: products } = await client
        .from('products')
        .select('id, updated_at')
      
      if (products) {
        productRoutes = products.map((prod) => ({
          url: `${baseUrl}/product/${prod.id}`,
          lastModified: prod.updated_at ? new Date(prod.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        }))
      }

      // Fetch posts
      const { data: posts } = await client
        .from('posts')
        .select('id, updated_at')

      if (posts) {
        postRoutes = posts.map((post) => ({
          url: `${baseUrl}/tin-tuc/${post.id}`,
          lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        }))
      }
    } catch (e) {
      console.error('Error generating dynamic sitemap:', e)
    }
  }

  return [...staticRoutes, ...productRoutes, ...postRoutes]
}