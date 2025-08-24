function stripMarkdown(md) {
  return md
    .replace(/!\[.*?\]\(.*?\)/g, "") // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // inline code
    .replace(/^\s*>\s?/gm, "") // blockquotes
    .replace(/^\s*-\s+/gm, "") // unordered list dashes at line start
    .replace(/^\s*\*\s+/gm, "") // unordered list asterisks at line start
    .replace(/^\s*\d+\.\s+/gm, "") // ordered list numbers at line start
    .replace(/[*_~#]/g, "") // emphasis, strikethrough, headers
    .trim();
}

export default stripMarkdown;
