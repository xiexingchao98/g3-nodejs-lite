module.exports = class extends think.Logic {
  detailAction() {
    this.allowMethods = 'get'
  }
  viewByCategoryAction() {
    this.allowMethods = 'get'
  }
}