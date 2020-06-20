// eslint-disable-next-line no-unused-vars
import {$} from '@core/dom'

export class Excel {
  constructor(selector, options) {
    this.$el = document.querySelector(selector)
    this.components = options.components || []
  }

  getRoot() {
    const $root = $.create('div', 'excel')
    this.components.forEach(Component => {
      const $elem = $.create('div', Component.className)
      const component = new Component($elem)
      $elem.html(component.toHTML())
      // afterbegin, afterend, beforeend, beforebegin
      $root.append($elem)
    })
    return $root
  }

  render() {
    this.$el.append(this.getRoot().$el)
  }
}
