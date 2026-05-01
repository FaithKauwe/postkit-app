/**
 * Workaround: the published package's `dist/index.js` uses extensionless `./formatDate` imports,
 * which fail under Vitest/Node ESM. Re-export from explicit `.js` files (paths avoid the broken barrel).
 *
 * Do not re-export `dist/formatRelativeDate.js`: it internally imports `./formatDate` without an
 * extension, which Vitest resolves with Node ESM rules and crashes. Inline the same logic here.
 */
export { formatDate } from '../../node_modules/postkit-date-status-display/dist/formatDate.js'
export { statusToLabel } from '../../node_modules/postkit-date-status-display/dist/statusToLabel.js'
export { statusToColor } from '../../node_modules/postkit-date-status-display/dist/statusToColor.js'
export type { PostStatus } from '../../node_modules/postkit-date-status-display/dist/types.js'

import { formatDate } from '../../node_modules/postkit-date-status-display/dist/formatDate.js'

const MS_PER_MINUTE = 1000 * 60
const MS_PER_HOUR = MS_PER_MINUTE * 60
const MS_PER_DAY = MS_PER_HOUR * 24

/** Matches publish behavior of `postkit-date-status-display` `formatRelativeDate`. */
export function formatRelativeDate(dateString: string) {
  if (!dateString || dateString === '') {
    return null
  }
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return null
  }
  const diffMs = Date.now() - date.getTime()
  if (diffMs < 0) {
    return formatDate(dateString)
  }
  const diffMinutes = Math.floor(diffMs / MS_PER_MINUTE)
  const diffHours = Math.floor(diffMs / MS_PER_HOUR)
  const diffDays = Math.floor(diffMs / MS_PER_DAY)
  if (diffMinutes < 1) return 'just now'
  if (diffMinutes < 60) return `${diffMinutes} min ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays === 1) return 'yesterday'
  if (diffDays <= 7) return `${diffDays} days ago`
  return formatDate(dateString)
}
