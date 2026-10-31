import { copyFileSync, mkdirSync } from "node:fs";
mkdirSync("public/fonts", { recursive: true });
copyFileSync("node_modules/@fontsource/public-sans/files/public-sans-latin-600-normal.woff", "public/fonts/label.woff");
