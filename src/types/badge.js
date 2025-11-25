/**
 * @typedef {Object} Badge
 * @property {number} id
 * @property {string} nome
 * @property {string} requisito
 * @property {string} icone - URL ou caminho da imagem do badge
 */

/**
 * @typedef {Object} CreateBadgeDto
 * @property {string} nome
 * @property {string} requisito
 * @property {string} icone
 */

/**
 * @typedef {Object} UpdateBadgeDto
 * @property {number|string} id
 * @property {string} [nome]
 * @property {string} [requisito]
 * @property {string} [icone]
 */

/**
 * @typedef {Object} BadgeResponseList
 * @property {Badge[]} data
 */

/**
 * @typedef {Object} BadgeResponseSingle
 * @property {Badge} data
 */

