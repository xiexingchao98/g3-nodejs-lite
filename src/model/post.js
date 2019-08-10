module.exports = class extends think.Model {
  getDefaultIndex(limit) {
    return this.query(`select post_id, post_title, last_comment_time, create_time, (select count(*) from comment where post.post_id=comment.post_id) as post_comment_count, (select nick_name from user where user.user_id=post.post_owner_id) as post_owner_name from post order by last_comment_time desc limit ${limit}`)
  }
  getCommentById(id) {
    return this.query(`select comment_content, (select nick_name from user where user.user_id=comment.comment_owner_id) as comment_owner_name, create_time from comment where post_id=${id}`)
  }
  getDetailById(id) {
    return this.query(`select post_id, post_title, post_content, create_time, post_owner_id, (select nick_name from user where user.user_id=post.post_owner_id) as post_owner_name from post where post_id=${id} limit 1`)
  }
}