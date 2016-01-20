'use strict'

const env = process.env.NODE_ENV || 'development'

module.exports = {
  connector: require(env === 'production' ? 'levelup' : 'level-mem'),
  path: './fink.db',
  counterId: '__id'
}
