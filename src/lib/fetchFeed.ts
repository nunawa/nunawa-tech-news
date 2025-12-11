import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { feedSchema, type Feed } from "./schema";

export async function fetchFeed(): Promise<Feed> {
	const accountId = import.meta.env.ACCOUNT_ID;
	const accessKeyId = import.meta.env.ACCESS_KEY_ID;
	const secretAccessKey = import.meta.env.SECRET_ACCESS_KEY;

	if (!accountId || !accessKeyId || !secretAccessKey) {
		throw new Error(
			"Missing required environment variables: ACCOUNT_ID, ACCESS_KEY_ID, SECRET_ACCESS_KEY",
		);
	}

	const client = new S3Client({
		region: "auto",
		endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId,
			secretAccessKey,
		},
	});

	try {
		console.log("Fetching feed.json from S3...");
		const command = new GetObjectCommand({
			Bucket: "technews-feed",
			Key: "feed.json",
		});

		const response = await client.send(command);

		if (!response.Body) {
			throw new Error("Empty response body from S3");
		}

		const uploadedAt = response.LastModified;

		const bodyString = await response.Body.transformToString("utf-8");
		const rawData = JSON.parse(bodyString);

		console.log("Validating feed schema...");
		const validatedData = feedSchema.parse(rawData);

		// 重複除外: linkでユニークにする
		const uniqueArticles = validatedData.articles.filter(
			(article, index, self) =>
				self.findIndex((a) => a.link === article.link) === index,
		);

		console.log(
			`Successfully fetched and validated ${uniqueArticles.length} articles`,
		);

		return {
			uploadedAt,
			articles: uniqueArticles,
		};
	} catch (error) {
		console.error("Failed to fetch or validate feed:", error);
		throw error;
	}
}
