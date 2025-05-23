export class DomListener {
  constructor($root) {
    if (!$root) {
      throw new Error(`No $root provided for DomListener`)
    }
    this.$root = $root
  }

  initDOMListeners() {
    if (!this.listeners || this.listeners.length === 0) {
      return;
    }
    this.listeners.forEach(listener => {
      const methodName = getMethodName(listener)
      if (!this[methodName]) {
        throw new Error(
            `Method ${methodName} is not implemented in ${this.name || ''} Component`
        )
      }
      // Bind the method to this instance and store it
      // so we can remove the exact same function instance later.
      this[methodName] = this[methodName].bind(this)
      this.$root.on(listener, this[methodName])
    })
  }

  removeDOMListeners() {
    if (!this.listeners || this.listeners.length === 0) {
      return;
    }
    this.listeners.forEach(listener => {
      const methodName = getMethodName(listener)
      if (this[methodName]) { // Check if the method was bound
        this.$root.off(listener, this[methodName])
      }
    })
  }
}

function getMethodName(eventName) {
  return 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1)
}
