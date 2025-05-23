// eslint-disable-next-line no-unused-vars
import {$} from '@core/dom'

export class Excel {
  constructor(selector, options) {
    this.$el = $(selector) // Use $ utility
    this.componentClasses = options.components || []
    this.emitter = options.emitter
    this.components = [] // To store component instances
  }

  getRoot() {
    const $root = $.create('div', 'excel')
    // Clear previous instances if any, and prepare for new ones
    this.components = [] 
    
    this.componentClasses.forEach(ComponentClass => {
      const $el = $.create('div', ComponentClass.className)
      const component = new ComponentClass($el, {emitter: this.emitter})
      
      $el.html(component.toHTML())
      $root.append($el)
      
      // Initialize the component after its DOM is ready and appended
      component.init() 
      
      // Store the initialized component instance
      this.components.push(component)
    })

    return $root
  }

  render() {
    // getRoot now also initializes components
    this.$el.append(this.getRoot().$el) 
  }

  destroy() {
    this.components.forEach(component => component.destroy())
    // Optionally, clear this.components if Excel instance can be re-rendered
    // this.components = []
    // Optionally, clear the $el content
    // this.$el.clear()
  }
}
