/**
 * Workaround: the published package's `dist/index.js` uses extensionless `./formatDate` imports,
 * which fail under Vitest/Node ESM. Re-export from explicit `.js` files (paths avoid the broken barrel).
 */
export { formatDate } from '../../node_modules/postkit-date-status-display/dist/formatDate.js'
export { formatRelativeDate } from '../../node_modules/postkit-date-status-display/dist/formatRelativeDate.js'
export { statusToLabel } from '../../node_modules/postkit-date-status-display/dist/statusToLabel.js'
export { statusToColor } from '../../node_modules/postkit-date-status-display/dist/statusToColor.js'
export type { PostStatus } from '../../node_modules/postkit-date-status-display/dist/types.js'
