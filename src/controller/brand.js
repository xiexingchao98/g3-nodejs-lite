module.exports = class extends think.Controller {
  async indexAction() {
    let data = await this.model('brand').select()
    this.json(data)
  }
}