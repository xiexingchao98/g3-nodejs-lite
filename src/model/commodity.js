module.exports = class extends think.Model {
  getIndexRecommend() {
    return this.field('commodity_id,commodity_name,commodity_price,commodity_cover').limit(20).select()
  }
  getCommodityById(commodity_id) {
    return this.where({commodity_id: commodity_id}).find()
  }
  getByCategoryAndTags(category_id, tags) {
    return this.query(`select a.commodity_id, a.commodity_name, a.commodity_price, a.commodity_cover from commodity as a inner join (select distinct commodity_id from tag_mapping where tag_id in (${tags})) as b on a.commodity_id = b.commodity_id where a.commodity_category_id = ${category_id};`)
  }
  getCommodityByBrandId(brandId) {
    return this.query(`select * from commodity where commodity_brand_id=${brandId}`)
  }
}