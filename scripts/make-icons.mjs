/**
 * Generates simple solid-color PNG icons for PWA.
 * Pure Node.js — no dependencies.
 */
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import zlib from 'zlib'

const __dirname = dirname(fileURLToPath(import.meta.url))

function createPNG(size, bgR, bgG, bgB) {
  // IHDR
  function u32be(v) {
    const b = Buffer.alloc(4)
    b.writeUInt32BE(v)
    return b
  }
  function crc32(buf) {
    let crc = 0xffffffff
    for (const byte of buf) {
      crc ^= byte
      for (let j = 0; j < 8; j++) crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1)
    }
    return (crc ^ 0xffffffff) >>> 0
  }
  function chunk(type, data) {
    const typeBytes = Buffer.from(type, 'ascii')
    const lenBuf = u32be(data.length)
    const crcBuf = u32be(crc32(Buffer.concat([typeBytes, data])))
    return Buffer.concat([lenBuf, typeBytes, data, crcBuf])
  }

  // IHDR: width, height, bit depth 8, color type 2 (RGB)
  const ihdr = Buffer.concat([u32be(size), u32be(size), Buffer.from([8, 2, 0, 0, 0])])

  // Image data: each row has a filter byte (0) + RGB pixels
  const rowSize = 1 + size * 3
  const raw = Buffer.alloc(size * rowSize, 0)
  for (let y = 0; y < size; y++) {
    const base = y * rowSize
    raw[base] = 0 // filter = none
    for (let x = 0; x < size; x++) {
      raw[base + 1 + x * 3] = bgR
      raw[base + 1 + x * 3 + 1] = bgG
      raw[base + 1 + x * 3 + 2] = bgB
    }
  }
  const compressed = zlib.deflateSync(raw)

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const idat = chunk('IDAT', compressed)
  const iend = chunk('IEND', Buffer.alloc(0))

  return Buffer.concat([sig, chunk('IHDR', ihdr), idat, iend])
}

// Dark background #1D1D1F = rgb(29, 29, 31)
const icon192 = createPNG(192, 29, 29, 31)
const icon512 = createPNG(512, 29, 29, 31)

writeFileSync(join(__dirname, '../public/pwa-192x192.png'), icon192)
writeFileSync(join(__dirname, '../public/pwa-512x512.png'), icon512)
writeFileSync(join(__dirname, '../public/apple-touch-icon.png'), createPNG(180, 29, 29, 31))

console.log('✓ PNG icons generated')
