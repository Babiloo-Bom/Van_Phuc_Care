export default defineEventHandler(async (event) => {
  const baseUrl = 'https://vanphuccare.com'
  
  // Static pages
  const staticPages = [
    {
      url: '/',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      url: '/courses',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      url: '/login',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.5'
    },
    {
      url: '/register',
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: '0.5'
    }
  ]

  // Fetch courses from API
  let courses: any[] = []
  try {
    const response = await $fetch(`${baseUrl}/api/a/courses`)
    courses = response.data?.courses || []
  } catch (error) {
  }

  // Dynamic course pages
  const coursePages = courses.map(course => ({
    url: `/courses/${course.slug}`,
    lastmod: course.updatedAt || course.createdAt || new Date().toISOString(),
    changefreq: 'weekly',
    priority: '0.8'
  }))

  const allPages = [...staticPages, ...coursePages]

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  // Set headers
  setHeader(event, 'Content-Type', 'application/xml')
  setHeader(event, 'Cache-Control', 'public, max-age=3600') // Cache for 1 hour

  return sitemap
})
