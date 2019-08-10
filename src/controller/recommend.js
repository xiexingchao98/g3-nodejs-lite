module.exports = class extends think.Controller {
  async indexAction () {
    let data = await this.model('commodity').getIndexRecommend()
    this.json(data)
  }
  async personalAction () {
    let category_id = this.post('category_id')
    let tags = this.post('tags')
    let data = await this.model('commodity').getByCategoryAndTags(category_id, tags)
    this.json(data)
  }
}