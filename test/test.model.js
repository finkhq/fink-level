/* global describe, it */

'use strict'

require('should')

const url = require('lib/model')

describe('url', function () {
  it('check if "nothing" is register', function (done) {
    url.isRegister('nothing', function (err, isRegister, results) {
      isRegister.should.be.false()
      done(err)
    })
  })

  it('register "something"', function (done) {
    url.register('google.com', 'google.es', function (err, instance) {
      instance.should.be.an.Object()
      done(err)
    })
  })

  it('check if "something" is register', function (done) {
    url.isRegister('google.com', function (err, isRegister, result) {
      isRegister.should.be.true()
      done(err)
    })
  })
})
