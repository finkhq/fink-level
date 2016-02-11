/* global describe, it */

'use strict'

require('should')

const config = require('./config')
const URL = require('lib/model')(config)
const schema = require('lib/schema')

let globalInstance

describe('URI', function () {
  it('check if a "google.com" hash is register register', function (done) {
    URL.isRegister('nothing', function (err, isRegister, results) {
      isRegister.should.be.false()
      done(err)
    })
  })

  it('register "google.com"', function (done) {
    URL.register('google.com', function (err, instance) {
      globalInstance = instance
      instance.should.be.an.Object()

      const instanceProperties = Object.keys(instance).length
      const schemaProperties = Object.keys(schema).length

      instanceProperties.should.be.equal(schemaProperties)

      Object.keys(instance).forEach(function (key) {
        let value = instance[key]
        let type = schema[key].name
        value.should.be[type]()
      })

      done(err)
    })
  })

  it('check if "google.com" hash is register', function (done) {
    URL.isRegister(globalInstance.hash, function (err, isRegister, result) {
      isRegister.should.be.true()
      done(err)
    })
  })

  it('check if "google.com" emoji hash is register', function (done) {
    URL.isRegister(globalInstance.hashEmoji, function (err, isRegister, result) {
      isRegister.should.be.true()
      done(err)
    })
  })
})
