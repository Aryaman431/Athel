// Generates simple PNG icons for PWA using canvas-like SVG approach
// Run once with: node scripts/generate-icons.mjs

import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// We create minimal valid PNGs using raw bytes for the simplest possible icon
// These are placeholder icons - replace with your actual brand icons
function createSimpleSVGIcon(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="#1D1D1F"/>
  <text x="${size/2}" y="${size * 0.72}" font-family="Georgia, serif" font-size="${Math.round(size * 0.52)}" font-weight="bold" fill="white" text-anchor="middle">Æ</text>
</svg>`
}

// Write SVG files (vite-plugin-pwa will handle conversion, or use as fallback)
writeFileSync(join(__dirname, '../public/pwa-192x192.svg'), createSimpleSVGIcon(192))
writeFileSync(join(__dirname, '../public/pwa-512x512.svg'), createSimpleSVGIcon(512))

console.log('SVG icons generated in public/')
