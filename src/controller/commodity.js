module.exports = class extends think.Controller {
  async detailAction () {
    let commodity_id = this.get('id')
    let data = await this.model('commodity').getCommodityById(commodity_id)
    data.commodity_tag = JSON.parse(data.commodity_tag)
    this.json(data)
  }
  async viewByCategoryAction() {
    let data = await this.model('commodity').where({commodity_category_id: this.get('id')}).select()
    this.json(data)
  }
  async latestAction() {
    let data = await this.model('commodity').order({commodity_create_time: 'desc'}).limit(50).select()
    this.json(data)
  }
  async searchAction() {
    let keyword = this.get('keyword')
    let data = await this.model('commodity').where(`commodity_name like '%${keyword}%'`).select()
    this.json(data)
  }
  async hotAction() {
    let data = await this.model('commodity').order({commodity_hot: 'desc'}).limit(50).select()
    this.json(data)
  }
  async viewByBrandIdAction() {
    let data = await this.model('commodity').getCommodityByBrandId(this.get('brandId'))
    this.json(data)
  }
}