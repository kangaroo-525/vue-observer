const { observer, Watcher } = require('./observe')
class Vue {
  constructor(options) {
    this._data = options.data
    observer(this._data)
    new Watcher()
    console.log('render~', this._data.name);
  }
}

let vue = new Vue({
  data: {
    name: 'vue'
  }
})
