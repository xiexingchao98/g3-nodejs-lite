module.exports = class extends think.Logic {
  indexAction() {
    this.allowMethods = 'get'
  }
  viewDetailAction() {
    this.allowMethods = 'get'
  }
  newAction() {
    this.allowMethods = 'post'
  }
  doCommentAction() {
    this.allowMethods = 'post'
  }
  viewCommentAction() {
    this.allowMethods = 'get'
  }
}