---
mode: agent
description: "Add a new blog post"
---

Create a new blog post for the HeadlessOS blog.

## Context
- Read `src/content.config.ts` for the blog schema (required/optional fields)
- Read `src/content/blog/introducing-headlessos.md` as a format reference
- Blog listing: `src/pages/blog/index.astro`

## Instructions
1. Create `src/content/blog/{slug}.md` (or `.mdx` if components are needed)
2. Required frontmatter: `title`, `description`, `pubDate` (YYYY-MM-DD)
3. Optional: `author`, `tags` (string array), `draft` (boolean), `updatedDate`
4. Write in a professional, developer-friendly tone
5. Run `npm run build` to verify the post renders
