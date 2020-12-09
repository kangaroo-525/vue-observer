const { observer } = require('./observe')
class Vue {
  constructor(options) {
    this._data = options.data
    observer(this._data)
  }
}

let vue = new Vue({
  data: {
    name: 'vue'
  }
})
vue._data.name = 'hello vue'
console.log(vue._data.name)
