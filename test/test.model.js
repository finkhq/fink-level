/* global describe, it */

'use strict'

require('should')

const URL = require('lib/model')

describe('URL', function () {
  it('check if "nothing" is register', function (done) {
    URL.isRegister('nothing', function (err, isRegister, results) {
      isRegister.should.be.false()
      done(err)
    })
  })

  it('register "something"', function (done) {
    URL.register('google.com', function (err, instance) {
      instance.should.be.an.Object()
      done(err)
    })
  })

  it('check if "something" is register', function (done) {
    URL.isRegister('google.com', function (err, isRegister, result) {
      isRegister.should.be.true()
      done(err)
    })
  })
})
