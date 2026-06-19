import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const readJson = async (filePath) => {
  const contents = await readFile(path.join(root, filePath), "utf8");
  return JSON.parse(contents);
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const parseFrontmatter = (contents) => {
  if (!contents.startsWith("---\n")) {
    return { data: {}, body: contents.trim() };
  }

  const end = contents.indexOf("\n---", 4);
  if (end === -1) {
    throw new Error("Missing closing frontmatter marker in content/bio.md");
  }

  const frontmatter = contents.slice(4, end).trim();
  const body = contents.slice(end + 4).trim();
  const data = {};

  for (const line of frontmatter.split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    data[key] = value.replace(/^["']|["']$/g, "");
  }

  return { data, body };
};

const markdownToHtml = (markdown) =>
  markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${escapeHtml(block).replaceAll("\n", "<br />\n")}</p>`)
    .join("\n          ");

const replaceToken = (template, token, value) =>
  template.replaceAll(`{{${token}}}`, value);

const site = await readJson("content/site.json");
const socialLinks = await readJson("content/social-links.json");
const about = parseFrontmatter(
  await readFile(path.join(root, "content/bio.md"), "utf8"),
);
let template = await readFile(path.join(root, "templates/index.html"), "utf8");

const fontLinks = [
  ...(site.font?.preconnect ?? []).map((href) => {
    const crossorigin = href.includes("gstatic") ? " crossorigin" : "";
    return `<link rel="preconnect" href="${escapeHtml(href)}"${crossorigin} />`;
  }),
  site.font?.stylesheet
    ? `<link href="${escapeHtml(site.font.stylesheet)}" rel="stylesheet" />`
    : "",
]
  .filter(Boolean)
  .join("\n    ");

const renderedSocialLinks = socialLinks
  .map(
    (link) =>
      `<a href="${escapeHtml(link.href)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`,
  )
  .join("\n          ");

const tokens = {
  lang: escapeHtml(site.lang ?? "en"),
  description: escapeHtml(site.description),
  title: escapeHtml(site.title),
  fontLinks,
  heroImage: escapeHtml(site.hero.image),
  heroAlt: escapeHtml(site.hero.alt),
  aboutAriaLabel: escapeHtml(about.data.ariaLabel ?? "Introduction"),
  name: escapeHtml(about.data.name ?? site.title),
  bioHtml: markdownToHtml(about.body),
  socialLinks: renderedSocialLinks,
};

for (const [token, value] of Object.entries(tokens)) {
  template = replaceToken(template, token, value);
}

await writeFile(path.join(root, "index.html"), template);
