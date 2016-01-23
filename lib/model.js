'use strict'

const db = require('./db')
const jsonFuture = require('json-future')
const shortener = require('fink-shortener')

let URL = {}

URL.register = function (url, cb) {
  db.nextCounter(function (err, id) {
    if (err) return cb(err)

    // id, hash, emojifier
    let instance = shortener(id)

    instance.url = url
    instance.count = 0
    instance.createdAt = new Date()
    instance.updateAt = new Date()

    URL.save(url, instance, function (err) {
      if (err) return cb(err)
      return cb(err, instance)
    })
  })
}

URL.incrementCounter = function (instance, cb) {
  jsonFuture.parseAsync(instance, function (err, content) {
    if (err) return cb(err)
    ++content.count
    content.updateAt = new Date()
    URL.save(instance.key, content, function (err) {
      return cb(err, content.counter, content)
    })
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
  return db.getBy('url', url, cb)
}

module.exports = URL
