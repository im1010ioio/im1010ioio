import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

const SITE = 'https://im1010ioio.dev'

// Static pages with fixed priorities
const STATIC_PAGES = [
	{ url: '/', priority: 1.0 },
	{ url: '/blog/', priority: 0.9 },
	{ url: '/polaris-lab/', priority: 0.9 },
	{ url: '/about/', priority: 0.7 },
	{ url: '/now/', priority: 0.7 },
	{ url: '/privacy/', priority: 0.64 },
]

function formatDate(date: Date): string {
	return date.toISOString()
}

function formatPriority(p: number): string {
	return p.toFixed(2)
}

export const GET: APIRoute = async () => {
	const blogEntries = await getCollection('blog')
	const polarisEntries = await getCollection('polaris-lab')

	const blogUrls = blogEntries.map((entry) => ({
		url: `/blog/${entry.id.replace('.md', '')}/`,
		priority: entry.data.priority ?? 0.7,
		lastmod: entry.data.updatedDate ?? entry.data.pubDate,
	}))

	const polarisUrls = polarisEntries.map((entry) => ({
		url: `/polaris-lab/${entry.id.replace('.md', '')}/`,
		priority: entry.data.priority ?? 0.7,
		lastmod: entry.data.updatedDate ?? entry.data.pubDate,
	}))

	const contentUrls = [...blogUrls, ...polarisUrls]

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_PAGES.map(
	({ url, priority }) => `  <url>
    <loc>${SITE}${url}</loc>
    <priority>${formatPriority(priority)}</priority>
  </url>`,
).join('\n')}
${contentUrls
	.map(
		({ url, priority, lastmod }) => `  <url>
    <loc>${SITE}${url}</loc>
    <lastmod>${formatDate(lastmod)}</lastmod>
    <priority>${formatPriority(priority)}</priority>
  </url>`,
	)
	.join('\n')}
</urlset>`

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
		},
	})
}
