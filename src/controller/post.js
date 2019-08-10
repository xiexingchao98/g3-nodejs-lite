const crypto = require('crypto')
const g3 = require("../g3")

module.exports = class extends think.Controller {
 async newAction () {
    const data = this.post()
    let decrypted = g3.decrypt(data.storage)
    let pair = decrypted.split(':')
    let userid = pair[0]
    let openid = pair[1]
    let post = data.data
    let post_id = await this.model('post').add({ post_title: post.post_title, post_content: post.post_content, post_owner_id: userid })
    this.success({post_id: post_id}, '发布成功')
  }
  async deleteAction() {
    const post_id = this.post(post_id)
    let affectedRows = this.model('post').where({post_id: post_id}).delete()
    if (affectedRows < 1) {
      return this.fail('删除帖子失败')
    }
  }
  async doCommentAction () {
    let decrypted = g3.decrypt(this.post('storage'))
    let pair = decrypted.split(':')
    let userid = pair[0]
    let openid = pair[1]
    let data = this.post('data')
    data['comment_owner_id'] = userid

    let comment_id = await this.model('comment').add(data)
    this.success({comment_id: comment_id}, '评论发布成功')
  }
  async viewCommentAction() {
    let commentList = await this.model('post').getCommentById(this.get('id'))
    this.json(commentList)
  }
  async indexAction() {
    let data = await this.model('post').getDefaultIndex(20)
    this.json(data)
  }
  async viewDetailAction() {
    let data = await this.model('post').getDetailById(this.get('id'))
    this.json(data[0])
  }
  async searchAction() {
    let keyword = this.get('keyword')
    let data = await this.model('post').where(`post_title like '%${keyword}%'`).select()
    this.json(data)
  }
}