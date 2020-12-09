/**
 * 简版待完善
 */
function cb () {
  console.log('更新视图')
}
function defineReactive (obj, key, val) {
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get () {
      // 这里收集依赖
      dep.addSub(Dep.target)
      return val
    },
    set (newVal) {
      if (newVal === val) return
      dep.notify()
    }
  })
}

function observer (value) {
  if (!value || Object.prototype.toString.call(value) !== '[object Object]') return
  Object.keys(value).forEach(key => {
    defineReactive(value, key, value[key])
  })
}

// 依赖收集
class Dep {
  constructor () {
    // 初始化用来存放依赖(watcher对象)的数组
    this.subs = []
  }
  // 收集依赖(watcher对象)的方法
  addSub (sub) {
    this.subs.push(sub)
  }
  // 触发依赖(watcher对象)的方法
  notify () {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}

/**
 * 依赖
 */
Dep.target = null

class Watcher {
  constructor () {
    Dep.target = this
  }
  update () {
    console.log('视图被更新了')
  }
}

module.exports = {
  observer,
  Watcher
}