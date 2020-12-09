/**
 * 简版待完善
 */
function cb () {
  console.log('更新视图')
}
function defineReactive (obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get () {
      // 这里收集依赖
      return val
    },
    set (newVal) {
      if (newVal === val) return
      cb(newVal)
    }
  })
}

function observer (value) {
  if (!value || Object.prototype.toString.call(value) !== '[object Object]') return
  Object.keys(value).forEach(key => {
    defineReactive(value, key, value[key])
  })
}

module.exports = {
  observer
}