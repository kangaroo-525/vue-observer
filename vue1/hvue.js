class Vue {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    observe(this.$data)
    proxy(this)
    new Compile(options.el, this)
  }
}

function proxy(vm) {
  Object.keys(vm.$data).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key]
      },
      set(val) {
        vm.$data[key] = val
      }
    })
  })
}

function observe(data) {
  if (typeof data !== "object" || data == null) {
    return data
  }
  new Observer(data)
}

function defineReactive(target, key, val) {
  observe(val)
  let dep = new Dep()
  Object.defineProperty(target, key, {
    get() {
      if (Dep.target) {
        dep.addDep(Dep.target)
      }
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        observe(newVal)
        val = newVal
        dep.notify()
      }
    }
  })
}

class Observer {
  constructor(data) {
    if (Array.isArray(data)) {
      // todo
    } else {
      this.walk(data)
    }
  }

  walk(data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

class Compile {
  constructor(el, vm) {
    this.$el = document.querySelector(el)
    this.$vm = vm
    this.compile(this.$el)
  }

  compile(el) {
    el.childNodes.forEach(node => {
      if (this.isElm(node)) {
        this.compileElm(node)
        // todo
        if (node.childNodes && node.childNodes.length > 0) {
          this.compile(node)
        }
      } else if (this.isInter(node)) {
        this.update(node, RegExp.$1, 'text')
      }
    })
  }

  compileElm(node) {
    Array.from(node.attributes).forEach(attr => {
      if (attr.name.startsWith('@')) {
        let event = attr.name.substring(1)
        let fn = this.$vm.$options.method[attr.value]
        node.addEventListener(event, fn.bind(this.$vm))
      } else {
        let type = attr.name.substring(2)
        if (type) {
          this.update(node, attr.value, type)
        }
      }
    })
  }

  update(node, exp, type) {
    if (type === 'model') {
      node.addEventListener('input', e => {
        this.$vm[exp] = e.target.value
      })
    }
    const fn = this[type + 'Updater']
    fn && fn(node, this.$vm[exp])

    new Watcher(this.$vm, exp, (val) => {
      fn && fn(node, val)
    })
  }

  modelUpdater(node, val) {
    node.value = val
  }

  textUpdater(node, val) {
    node.textContent = val
  }

  htmlUpdater(node, val) {
    node.innerHTML = val
  }

  isElm(node) {
    return node.nodeType === 1
  }

  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }

  // isEvent(dir) {
  //   re
  // }
}

class Watcher {
  constructor(vm, exp, fn) {
    this.$vm = vm
    this.exp = exp
    this.updateFn = fn
    Dep.target = this
    this.$vm[exp]
    Dep.target = null
  }

  update() {
    this.updateFn.call(this.$vm, this.$vm[this.exp])
  }
}

class Dep {
  constructor() {
    this.deps = []
  }

  addDep(dep) {
    this.deps.push(dep)
  }

  notify() {
    this.deps.forEach(dep => dep.update())
  }
}
