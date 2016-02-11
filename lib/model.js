'use strict'

const database = require('./db')
const util = require('util')
const noop = require('./util').noop
const isURI = require('is-uri')
const jsonFuture = require('json-future')
const shortener = require('fink-shortener')
const isEmojiHash = require('./util').isEmojiHash

module.exports = function (config) {
  const db = database(config)
  const URI = {}

  URI.register = function (uri, cb) {
    db.nextCounter(function (err, id) {
      if (err) return cb(err)

      // id, hash, hashEmoji
      let instance = shortener(id)

      instance.uri = uri
      instance.hits = 0
      instance.createdAt = new Date()
      instance.updateAt = new Date()

      URI.save(uri, instance, function (err) {
        if (err) return cb(err)
        return cb(err, instance)
      })
    })
  }

  URI.incrementCounter = function (instance, cb) {
    instance = util.isObject(instance) ? instance : JSON.parse(instance)
    cb = cb || noop

    ++instance.hits
    instance.updateAt = new Date()

    URI.save(instance.uri, instance, function (err) {
      cb(err, instance.hits, instance)
    })
  }

  URI.isRegister = function (uri, cb) {
    URI.find(uri, function (err, results) {
      return cb(err, results.length > 0, results)
    })
  }

  URI.save = function (uri, data, cb) {
    jsonFuture.stringifyAsync(data, function (err, raw) {
      if (err) return cb(err)
      return db.put(uri, raw, cb)
    })
  }

  URI.find = function (uri, cb) {
    if (isURI(uri)) return db.getBy('uri', uri, cb)
    const key = isEmojiHash(uri) ? 'hashEmoji' : 'hash'
    return db.getBy(key, uri, cb)
  }

  return URI
}
