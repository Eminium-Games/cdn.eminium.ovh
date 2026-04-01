// Génère un index.html dans chaque dossier du dépôt, listant tous les fichiers et dossiers avec des liens cliquables.
// Place ce fichier à la racine du projet et exécute-le avec `node generate-indexes.js`

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

function escapeHtml(str) {
  return str.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

function generateIndex(dir) {
  const relDir = path.relative(ROOT, dir).replace(/\\/g, "/");
  const items = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((f) => f.name !== "index.html")
    .sort((a, b) => a.name.localeCompare(b.name));

  let html = `<!doctype html>\n<html lang=\"fr\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Index de ${escapeHtml(relDir || "/")}</title>\n<style>body{font-family:sans-serif;background:#232526;color:#fff;padding:2em;}a{color:#ffb347;text-decoration:none;}a:hover{text-decoration:underline;}ul{list-style:none;padding:0;}li{margin:0.5em 0;}h1{color:#ffb347;}</style>\n</head>\n<body>\n<h1>Index de /${escapeHtml(relDir)}</h1>\n<ul>`;

  if (relDir) {
    html += `<li><a href="../">⬅️ Dossier parent</a></li>`;
  }

  for (const item of items) {
    const href =
      encodeURIComponent(item.name) + (item.isDirectory() ? "/" : "");
    const label = item.isDirectory() ? "📁 " + item.name : "📄 " + item.name;
    html += `<li><a href="${href}">${escapeHtml(label)}</a></li>`;
  }

  html += `</ul>\n</body>\n</html>`;
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

function walk(dir) {
  generateIndex(dir);
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      walk(path.join(dir, entry.name));
    }
  }
}

walk(ROOT);
console.log("Tous les index.html ont été générés.");
