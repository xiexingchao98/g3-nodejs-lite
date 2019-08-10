const crypto = require('crypto')

exports.encrypt = function (str) {
  let cipher = crypto.createCipher('aes192', 'g3project')
  let encrypted = cipher.update(str, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

exports.decrypt = function (str) {
  let decipher = crypto.createDecipher('aes192', 'g3project')
  let decrypted = decipher.update(str, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}