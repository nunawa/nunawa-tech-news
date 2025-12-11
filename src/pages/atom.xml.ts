import type { APIRoute } from "astro";
import { fetchFeed } from "../lib/fetchFeed";
import type { Article } from "../lib/schema";

/**
 * XML特殊文字のエスケープ
 */
function escapeXml(unsafe: string) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

/**
 * Atom Feed用のID生成
 */
function generateArticleId(article: Article): string {
	const hostname = new URL(article.link).hostname;
	const date = new Date(article.publishDate).toLocaleDateString("sv-SE");
	const path = new URL(article.link).pathname;
	return `tag:${hostname},${date}:${path}`;
}

export const GET: APIRoute = async () => {
	try {
		const feed = await fetchFeed();
		// 10件を取得
		const articles = feed.articles.slice(0, 10);

		const siteUrl = "https://news.nunawa.com";
		const title = "Nunawa Tech News";
		const description = "海外テック記事の日本語サマリを配信するニュースサイト";

		const rssItems = articles
			.map((article) => {
				const escapedTitle = escapeXml(article.title);
				const escapedLink = escapeXml(article.link);
				const homePage = new URL(article.link).origin;
				const pubDate = article.publishDate.toISOString();
				const escapedDescription = escapeXml(article.content);

				return `
					<entry>
						<title>${escapedTitle}</title>
						<link rel="alternate" href="${escapedLink}" />
						<author>
							<name>${homePage}</name>
						</author>
						<id>${generateArticleId(article)}</id>
						<updated>${pubDate}</updated>
						<summary>${escapedDescription}</summary>
			 			</entry>
				`;
			})
			.join("\n");

		const latestPubDate =
			articles.length > 0
				? articles[0].publishDate.toISOString()
				: new Date().toISOString();

		const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
			<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="ja">
				<title>${escapeXml(title)}</title>
				<subtitle>${escapeXml(description)}</subtitle>
				<link rel="self" type="application/atom+xml" href="${siteUrl}/atom.xml" />
				<link rel="alternate" href="${siteUrl}" />
				<id>tag:news.nunawa.com,2025-12:/atom.xml</id>
				<updated>${latestPubDate}</updated>
				${rssItems}
			</feed>
		`;

		return new Response(rssXml, {
			headers: {
				"Content-Type": "application/xml; charset=utf-8",
			},
		});
	} catch (error) {
		console.error("Failed to generate RSS feed:", error);
		throw error;
	}
};
