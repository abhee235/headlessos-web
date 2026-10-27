// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://headlessos.com",
  trailingSlash: "never",
  // Docs moved under /docs; keep the old top-level URLs working
  redirects: {
    "/introduction": "/docs/introduction",
    "/getting-started": "/docs/getting-started",
    "/installation": "/docs/installation",
    "/contributing": "/docs/contributing",
    "/roadmap": "/docs/roadmap",
    "/apps/dashboard": "/docs/apps/dashboard",
    "/apps/docker": "/docs/apps/docker",
    "/apps/file-explorer": "/docs/apps/file-explorer",
    "/apps/server-admin": "/docs/apps/server-admin",
    "/apps/terminal": "/docs/apps/terminal",
    "/concepts/architecture": "/docs/concepts/architecture",
    "/concepts/parsing": "/docs/concepts/parsing",
    "/concepts/security": "/docs/concepts/security",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap(),
    starlight({
      title: "HeadlessOS Docs",
      description:
        "Documentation for HeadlessOS, a desktop for your Linux servers over SSH.",
      logo: {
        src: "./src/assets/logo-mark.svg",
        replacesTitle: false,
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/abhee235/headlessos",
        },
      ],
      editLink: {
        baseUrl:
          "https://github.com/abhee235/headlessos-web/edit/main/src/content/docs/",
      },
      customCss: ["./src/styles/starlight.css"],
      // Dark only: one code theme, so code blocks never turn white in light mode
      expressiveCode: { themes: ["github-dark-default"] },
      head: [
        { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" } },
        { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: true } },
        {
          tag: "link",
          attrs: {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap",
          },
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", slug: "docs/introduction" },
            { label: "Quick Start", slug: "docs/getting-started" },
            { label: "Installation", slug: "docs/installation" },
          ],
        },
        {
          label: "Concepts",
          items: [
            { label: "Architecture", slug: "docs/concepts/architecture" },
            { label: "How Parsing Works", slug: "docs/concepts/parsing" },
            { label: "Security Model", slug: "docs/concepts/security" },
          ],
        },
        {
          label: "Apps",
          items: [
            { label: "Dashboard", slug: "docs/apps/dashboard" },
            { label: "File Explorer", slug: "docs/apps/file-explorer" },
            { label: "Docker", slug: "docs/apps/docker" },
            { label: "Terminal", slug: "docs/apps/terminal" },
            { label: "Server Admin", slug: "docs/apps/server-admin" },
          ],
        },
        {
          label: "Contributing",
          items: [
            { label: "Contribute", slug: "docs/contributing" },
            { label: "Roadmap", slug: "docs/roadmap" },
          ],
        },
      ],
      components: {
        // Use our own marketing-style header on docs too
        // Header: "./src/components/docs/DocsHeader.astro",
      },
      disable404Route: true,
      pagefind: true,
      lastUpdated: true,
    }),
    mdx(),
  ],
});
