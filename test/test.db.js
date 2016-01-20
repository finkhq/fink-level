/* global describe, it */

'use strict'

require('should')

const db = require('lib/db')

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
