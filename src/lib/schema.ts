import { z } from "zod";

export const articleSchema = z.object({
	title: z.string().min(1),
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
