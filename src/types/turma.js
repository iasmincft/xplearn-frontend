/**
 * @typedef {Object} Turma
 * @property {number} id
 * @property {string} nome
 * @property {string} professor_matricula_fk
 */

/**
 * @typedef {Object} CreateTurmaDto
 * @property {string} nome
 * @property {string} professor_matricula_fk
 */

/**
 * @typedef {Object} UpdateTurmaDto
 * @property {number|string} id
 * @property {string} [nome]
 * @property {string} [professor_matricula_fk]
 */

/**
 * @typedef {Object} TurmaResponseList
 * @property {Turma[]} data
 */

/**
 * @typedef {Object} TurmaResponseSingle
 * @property {Turma} data
 */

