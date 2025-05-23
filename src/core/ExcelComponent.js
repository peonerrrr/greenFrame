import {DomListener} from '@core/DomListener';

export class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root)
    this.name = options.name || ''
    this.emitter = options.emitter
    this.listeners = options.listeners || []
  }

  // Returns component template
  toHTML() {
    return ''
  }

  init() {
    this.initDOMListeners()
  }

  destroy() {
    this.removeDOMListeners()
  }
}
