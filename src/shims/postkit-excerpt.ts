/**
 * Published `dist/index.js` uses extensionless subpath imports — breaks Vitest/Node ESM.
 * Re-export leaf modules and inline `createExcerpt` so we never load `dist/createExcerpt.js`
 * (it imports `./normalizeWhitespace` without `.js`).
 */
export { normalizeWhitespace } from '../../node_modules/postkit-excerpt/dist/normalizeWhitespace.js'
export { truncateByWords } from '../../node_modules/postkit-excerpt/dist/truncateByWords.js'

import { normalizeWhitespace } from '../../node_modules/postkit-excerpt/dist/normalizeWhitespace.js'

/** Matches publish behavior of `postkit-excerpt` `createExcerpt`. */
export function createExcerpt(text: string, maxLength: number) {
  if (maxLength === 0) return ''
  const cleaned = normalizeWhitespace(text)
  if (!cleaned) return ''
  if (cleaned.length <= maxLength) return cleaned
  const trimmed = cleaned.slice(0, maxLength)
  const lastSpace = trimmed.lastIndexOf(' ')
  if (lastSpace === -1) {
    const firstWordEnd = cleaned.indexOf(' ')
    return (
      cleaned.slice(0, firstWordEnd === -1 ? cleaned.length : firstWordEnd) + '…'
    )
  }
  return trimmed.slice(0, lastSpace) + '…'
}
