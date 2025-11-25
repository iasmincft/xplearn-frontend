/**
 * @typedef {Object} Atividade
 * @property {number} id
 * @property {string} nome
 * @property {string|null} [descricao]
 * @property {number} nota_max
 * @property {number} pontos
 * @property {number} badge_id_fk
 * @property {number} turma_id_fk
 * @property {string} data_entrega
 */

/**
 * @typedef {Object} CreateAtividadeDto
 * @property {string} nome
 * @property {string|null} [descricao]
 * @property {number} nota_max
 * @property {number} pontos
 * @property {number} badge_id_fk
 * @property {number} turma_id_fk
 * @property {string} data_entrega
 */

/**
 * @typedef {Object} UpdateAtividadeDto
 * @property {number|string} id
 * @property {string} [nome]
 * @property {string|null} [descricao]
 * @property {number} [nota_max]
 * @property {number} [pontos]
 * @property {number} [badge_id_fk]
 * @property {number} [turma_id_fk]
 * @property {string} [data_entrega]
 */

/**
 * @typedef {Object} AtividadeResponse
 * @property {Atividade[]} data
 */

/**
 * @typedef {Object} AtividadeResponseSingle
 * @property {Atividade} data
 */
