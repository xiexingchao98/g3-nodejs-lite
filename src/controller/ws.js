// 加载项目通用模块
const g3 = require('../g3.js')

var collection = []
var online = 0
// user-id: [{message obj}, {}...]
var messageCache = []

module.exports = class extends think.Controller {
  /*
   * 用户上下线统计
   */
  openAction () {
    online++
    console.log('current online user: ', online)
  }
  closeAction () {
    online--
    console.log('current online user: ', online)
  }
  /*
   * 客户端从服务端拉取未读消息
   */
  readMessageAction() {
    let data = this.wsData.data
    // 解密用户身份信息
    let decrypted = g3.decrypt(data.storage)
    let pair = decrypted.split(':')
    let userId = pair[0]
    let openId = pair[1]
    // 查询用户是否有未读消息
    if (!think.isEmpty(messageCache[userId])) {
      // 向用户返回未读消息
      this.emit('readMessage', messageCache[userId])
      // 清空服务端为用户暂存的消息
      messageCache[userId] = []
    }
    // 无未读消息，返回 0
    else
      this.emit('readMessage', 0)
  }
  /*
   * 客户端告知服务端，其与目标用户进行了互动，请通知对方此次互动行为
   * 即在对方未读消息中添加此次互动信息
   * 😂我也不知道这段注释该怎么写……
   */
  async sendMessageAction() {
    let data = this.wsData.data
    // 解密用户身份信息
    let decrypted = g3.decrypt(data.storage)
    let pair = decrypted.split(':')
    // 此次消息数据
    let message = data.message
    // 参与互动的帖子 ID
    let post_id = message.post_id
    // 查询这个帖子的部分详情
    let post = await this.model('post').field('post_id,post_title,post_owner_id').where({post_id: post_id}).find()

    /*
     * 在消息中增加评论者信息
     */

    // 增加评论者 ID
    message['comment_owner_id'] = pair[0]
    // 根据评论者 ID 查询其昵称
    let comment_owner = await this.model('user').field('nick_name').where({user_id: parseInt(pair[0], 10)}).find()
    // 增加评论者昵称
    message['comment_owner_name'] = comment_owner.nick_name
    // 增加帖子标题
    message['post_title'] = post.post_title
    /*
     * 查缓存，检测帖子主人是否存在未读消息队列
     */

    // 未读消息数组不存在，则新建空数组
    if (think.isEmpty(messageCache[post.post_owner_id])) {
      messageCache[post.post_owner_id] = []
    }
    // 将新消息加入未读消息数组
    messageCache[post.post_owner_id].push(message)
  }
}
