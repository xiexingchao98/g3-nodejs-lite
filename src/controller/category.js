module.exports = class extends think.Controller {
  async indexAction () {
    this.json(await this.model('category').select())
  }
}