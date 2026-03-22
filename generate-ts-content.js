const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, 'content', 'generated');
const stylesDir = path.join(__dirname, 'app', 'styles', 'generated');
const outDir = path.join(__dirname, 'lib', 'compiled-wp');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Convert HTML files
const htmlFiles = ['home.page.html', 'about-us.page.html', 'people.page.html', 'popups.html', 'footer.html'];
for (const file of htmlFiles) {
  if (fs.existsSync(path.join(contentDir, file))) {
    const content = fs.readFileSync(path.join(contentDir, file), 'utf8');
    const safeContent = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    const varName = file.replace(/\./g, '_').replace(/-/g, '_');
    fs.writeFileSync(path.join(outDir, `${file}.ts`), `export const content = \`${safeContent}\`;`);
  }
}

// Convert CSS files
const cssFiles = ['wp-emoji-styles.css', 'classic-theme-styles.css', 'global-styles.css', 'wp-custom.css', 'ocean-inline.css'];
for (const file of cssFiles) {
  if (fs.existsSync(path.join(stylesDir, file))) {
    const content = fs.readFileSync(path.join(stylesDir, file), 'utf8');
    const safeContent = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    const varName = file.replace(/\./g, '_').replace(/-/g, '_');
    fs.writeFileSync(path.join(outDir, `${file}.ts`), `export const content = \`${safeContent}\`;`);
  }
}

console.log("Compiled WP content into TS files successfully.");
