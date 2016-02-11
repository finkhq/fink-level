/* global describe, it */

'use strict'

require('should')
const config = require('./config')
const db = require('lib/db')(config)

describe('db', function () {
  it('get counter', function (done) {
    db.nextCounter(function (err, counter) {
      counter.should.be.equal(1)
      done(err)
    })
  })

  it('increment automatically counter', function (done) {
    db.nextCounter(function (err, counter) {
      counter.should.be.equal(2)
      done(err)
    })
  })
})
