/**
 * @typedef {Object} Atividade
 * @property {number|string} id
 * @property {string} nome
 * @property {string} descricao
 * @property {string} data
 * @property {boolean} concluida
 */

/**
 * @typedef {Object} CreateAtividadeDto
 * @property {string} nome
 * @property {string} descricao
 * @property {string} data
 */

/**
 * @typedef {Object} UpdateAtividadeDto
 * @property {number|string} id
 * @property {string} [nome]
 * @property {string} [descricao]
 * @property {string} [data]
 * @property {boolean} [concluida]
 */
