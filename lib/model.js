'use strict'

const db = require('./db')
const util = require('util')
const noop = require('./util').noop
const isURL = require('is-url-superb')
const jsonFuture = require('json-future')
const shortener = require('fink-shortener')
const isEmojiHash = require('./util').isEmojiHash

let URL = {}

URL.register = function (url, cb) {
  db.nextCounter(function (err, id) {
    if (err) return cb(err)

    // id, hash, hashEmoji
    let instance = shortener(id)

    instance.url = url
    instance.hits = 0
    instance.createdAt = new Date()
    instance.updateAt = new Date()

    URL.save(url, instance, function (err) {
      if (err) return cb(err)
      return cb(err, instance)
    })
  })
}

URL.incrementCounter = function (instance, cb) {
  instance = util.isObject(instance) ? instance : JSON.parse(instance)
  cb = cb || noop

  ++instance.hits
  instance.updateAt = new Date()

  URL.save(instance.url, instance, function (err) {
    cb(err, instance.hits, instance)
  })
}

URL.isRegister = function (url, cb) {
  URL.find(url, function (err, results) {
    return cb(err, results.length > 0, results)
  })
}

URL.save = function (url, data, cb) {
  jsonFuture.stringifyAsync(data, function (err, raw) {
    if (err) return cb(err)
    return db.put(url, raw, cb)
  })
}

URL.find = function (url, cb) {
  if (isURL(url)) return db.getBy('url', url, cb)
  const key = isEmojiHash(url) ? 'hashEmoji' : 'hash'
  return db.getBy(key, url, cb)
}

module.exports = URL
