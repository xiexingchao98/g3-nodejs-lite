const rp = require('request-promise')
const g3 = require('../../g3')

module.exports = class extends think.Controller {
  async weixinAction() {
    let code = this.post('code')
    let userInfo = think.omit(this.post('userInfo'), 'language')
    let newUserInfo = {}
    for (let key in userInfo) {
      newUserInfo[think.snakeCase(key)] = userInfo[key]
    }
    userInfo = newUserInfo
    let options = {
      method: 'GET',
      url: `https://api.weixin.qq.com/sns/jscode2session?appid=${process.env['weixin_appid']}&secret=${process.env['weixin_secret']}&js_code=${code}&grant_type=authorization_code`,
      json: true
    }
    console.log(options)
    let that = this
    await rp(options).then(async function(res) {
      think.logger.info(res)
      let user = await that.model('user').where({ openid: res.openid }).find()
      let openid = res.openid
      let session_key = res.session_key
      let userid = ''
      // 用户不存在
      if (think.isEmpty(user)) {
        userInfo['openid'] = openid
        userInfo['session_key'] = session_key
        userid = await that.model('user').add(userInfo)
      }
      // 用户已经存在
      else {
        userid = user.user_id
        userInfo['session_key'] = session_key
        let affectedRows = await that.model('user').where({openid: openid}).update(userInfo)
        if (affectedRows < 1) {
          return that.fail('登录失败，更新session_key时发生错误')
        }
      }
      let encrypted = g3.encrypt(userid + ':' + openid)
      console.log('encrypted data is : ', encrypted)
      return that.success(encrypted, '登录成功')
    })
  }
}