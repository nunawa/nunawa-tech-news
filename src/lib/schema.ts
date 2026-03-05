import { z } from "zod";

export const articleSchema = z.object({
	title: z.string().min(1),
	originalTitle: z.string().default(""), // 2026-03-06以前はoriginalTitleがないため、デフォルト値を空文字にする
	link: z.string().url(),
	publishDate: z.coerce.date(),
	content: z.string().min(1),
});

export const feedSchema = z.object({
	uploadedAt: z.date().optional(),
	articles: z.array(articleSchema),
});

export type Article = z.infer<typeof articleSchema>;
export type Feed = z.infer<typeof feedSchema>;
