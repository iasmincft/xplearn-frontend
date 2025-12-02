/**
 * @typedef {Object} Aluno
 * @property {string} matricula
 * @property {string} nome
 * @property {string} nickname
 * @property {number} xp
 * @property {number} nivel
 * @property {string|null} [icone]
 * @property {number} avatar_id_fk
 */

/**
 * @typedef {Object} CreateAlunoDto
 * @property {string} matricula
 * @property {string} nome
 * @property {string} nickname
 * @property {string} senha
 * @property {number} xp
 * @property {number} nivel
 * @property {string|null} [icone]
 * @property {number} avatar_id_fk
 */

/**
 * @typedef {Object} AlunoResponse
 * @property {Aluno[]} data
 */

/**
 * @typedef {Object} AlunoResponseSingle
 * @property {Aluno} data
 */

/**
 * @typedef {Object} Professor
 * @property {string} matricula
 * @property {string} nome
 * @property {string|null} [icone]
 * @property {number} avatar_id_fk
 */

/**
 * @typedef {Object} CreateProfessorDto
 * @property {string} matricula
 * @property {string} nome
 * @property {string} senha
 * @property {string|null} [icone]
 * @property {number} avatar_id_fk
 */

/**
 * @typedef {Object} ProfessorResponse
 * @property {Professor[]} data
 */

/**
 * @typedef {Object} ProfessorResponseSingle
 * @property {Professor} data
 */

/**
 * @typedef {Object} LoginAlunoRequest
 * @property {string} matricula
 * @property {string} senha
 */

/**
 * @typedef {Object} LoginProfessorRequest
 * @property {string} matricula
 * @property {string} senha
 */

/**
 * @typedef {Object} LoginAlunoResponse
 * @property {Object} data - Dicionário com token e dados do aluno
 */

/**
 * @typedef {Object} LoginProfessorResponse
 * @property {Object} data - Dicionário com token e dados do professor
 */

/**
 * @typedef {Object} User
 * @property {string} nome
 * @property {string} [nickname] - Apenas para alunos
 * @property {number} avatar_id_fk
 * @property {string|null} [icone]
 * @property {string} role - 'aluno' | 'professor'
 * @property {number} [xp] - Apenas para alunos
 * @property {number} [nivel] - Apenas para alunos
 */

