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
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap(),
    starlight({
      title: "HeadlessOS Docs",
      description:
        "Documentation for HeadlessOS — manage Linux servers with a desktop-class UI over SSH.",
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
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", slug: "introduction" },
            { label: "Quick Start", slug: "getting-started" },
            { label: "Installation", slug: "installation" },
          ],
        },
        {
          label: "Concepts",
          items: [
            { label: "Architecture", slug: "concepts/architecture" },
            { label: "How Parsing Works", slug: "concepts/parsing" },
            { label: "Security Model", slug: "concepts/security" },
          ],
        },
        {
          label: "Apps",
          items: [
            { label: "Dashboard", slug: "apps/dashboard" },
            { label: "File Explorer", slug: "apps/file-explorer" },
            { label: "Docker", slug: "apps/docker" },
            { label: "Terminal", slug: "apps/terminal" },
            { label: "Server Admin", slug: "apps/server-admin" },
          ],
        },
        {
          label: "Contributing",
          items: [
            { label: "Contribute", slug: "contributing" },
            { label: "Roadmap", slug: "roadmap" },
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
