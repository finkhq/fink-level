'use strict'

const async = require('async')
const sublevel = require('level-sublevel')
const schema = require('./schema')
const mappedIndex = require('level-mapped-index')

module.exports = function (config) {
  const level = config.connector
  const COUNTER_KEY = config.counterId

  function registerIndex (index, db) {
    db.registerIndex(index, function (key, value, emit) {
      value = JSON.parse(value)
      if (value[index]) emit(value[index].toString())
    })
  }

  let db = level(config.path)

  db = sublevel(db)
  db = mappedIndex(db)

  db.nextCounter = function (cb) {
    var counter

    function setupCounter (current, cb) {
      ++current
      counter = current
      return cb()
    }

    async.waterfall([
      function getCounter (next) {
        db.get(COUNTER_KEY, function (err, value) {
          if (err) {
            if (err.notFound) return setupCounter(0, next)
            return next(err)
          }
          return setupCounter(value, next)
        })
      },
      function updateCounter (next) {
        return db.put(COUNTER_KEY, counter, next)
      }
    ], function (err) {
      return cb(err, counter)
    })
  }

  Object.keys(schema).forEach(function (index) {
    registerIndex(index, db)
  })

  return db
}
