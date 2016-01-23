'use strict'

const emojis = require('base64-emoji/emojis.json')

module.exports = {
  isEmojiHash: function (hash) {
    const firstEmoji = new Buffer(hash).slice(0, 4).toString()
    return emojis.indexOf(firstEmoji) !== -1
  },

  noop: function () {}
}
