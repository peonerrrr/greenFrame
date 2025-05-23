import { DomListener } from './DomListener';

// Mock for this.$root
const mock$root = {
  on: jest.fn(),
  off: jest.fn(),
};

// Helper to create a component instance for testing
class TestComponent extends DomListener {
  constructor($root, listeners = []) {
    super($root);
    this.listeners = listeners;
    this.name = 'TestComponent'; // For error messages
  }

  onClick() {}
  onInput() {}
}

describe('DomListener', () => {
  let component;

  beforeEach(() => {
    // Reset mocks for $root before each test
    mock$root.on.mockClear();
    mock$root.off.mockClear();
  });

  it('should be defined', () => {
    expect(DomListener).toBeDefined();
  });

  it('constructor should throw error if no $root is provided', () => {
    expect(() => new DomListener()).toThrow('No $root provided for DomListener');
  });

  describe('initDOMListeners', () => {
    it('should not do anything if no listeners are defined', () => {
      component = new TestComponent(mock$root, []);
      component.initDOMListeners();
      expect(mock$root.on).not.toHaveBeenCalled();
    });

    it('should not do anything if listeners is undefined', () => {
      component = new TestComponent(mock$root);
      delete component.listeners; // Ensure it's undefined
      component.initDOMListeners();
      expect(mock$root.on).not.toHaveBeenCalled();
    });

    it('should add listeners if they are defined and methods exist', () => {
      component = new TestComponent(mock$root, ['click', 'input']);
      component.initDOMListeners();
      expect(mock$root.on).toHaveBeenCalledTimes(2);
      expect(mock$root.on).toHaveBeenCalledWith('click', component.onClick);
      expect(mock$root.on).toHaveBeenCalledWith('input', component.onInput);
    });

    it('should throw an error if a listener method is not implemented', () => {
      component = new TestComponent(mock$root, ['mousemove']); // onMousemove is not defined
      expect(() => component.initDOMListeners()).toThrow(
        'Method onMousemove is not implemented in TestComponent Component'
      );
    });

    it('should bind methods to the component instance', () => {
      // Use the existing TestComponent which has an onClick method
      component = new TestComponent(mock$root, ['click']);
      component.initDOMListeners();

      // Check that $root.on was called
      expect(mock$root.on).toHaveBeenCalled();
      
      // Get the callback function passed to $root.on
      const passedCallback = mock$root.on.mock.calls[0][1];
      
      // Check if the passed callback is a bound version of component.onClick
      // Bound functions have their .name property prefixed with "bound "
      expect(passedCallback.name).toBe('bound onClick');

      // Additionally, ensure 'this' context is correct when called
      // This requires component.onClick to do something testable with 'this'
      // Let's modify TestComponent.onClick for this purpose or add a new method
      
      // For now, the .name check is a good indication of .bind(this) being used.
      // A more thorough test would be:
      let contextCheck = null;
      const originalOnClick = component.onClick; // Keep original if TestComponent.onClick is simple
      component.onClick = function() { contextCheck = this; originalOnClick.call(this); };
      // Re-initialize listeners with the new onClick
      mock$root.on.mockClear(); // Clear previous mock calls
      component.initDOMListeners(); // This will re-bind the new component.onClick

      const newPassedCallback = mock$root.on.mock.calls[0][1];
      newPassedCallback(); // Call the bound function
      expect(contextCheck).toBe(component); // Check if 'this' was the component instance

      // Restore original onClick if modified (or use a different component for this specific test)
      // This part is more complex; for this PR, the .name check might be sufficient.
      // Sticking to the .name check as it's simpler and was the original intent.
      // The context check above is for illustration of a deeper test.
    });
  });

  describe('removeDOMListeners', () => {
    it('should not do anything if no listeners are defined', () => {
      component = new TestComponent(mock$root, []);
      component.removeDOMListeners();
      expect(mock$root.off).not.toHaveBeenCalled();
    });

    it('should not do anything if listeners is undefined', () => {
      component = new TestComponent(mock$root);
      delete component.listeners;
      component.removeDOMListeners();
      expect(mock$root.off).not.toHaveBeenCalled();
    });

    it('should remove listeners if they are defined', () => {
      component = new TestComponent(mock$root, ['click', 'input']);
      // initDOMListeners must be called first to ensure methods are bound
      // because removeDOMListeners uses the bound method reference.
      component.initDOMListeners();
      component.removeDOMListeners();
      expect(mock$root.off).toHaveBeenCalledTimes(2);
      expect(mock$root.off).toHaveBeenCalledWith('click', component.onClick);
      expect(mock$root.off).toHaveBeenCalledWith('input', component.onInput);
    });

     it('should not throw error if a method was missing during init (and thus not bound)', () => {
      class FaultyComponent extends DomListener {
        constructor($r) {
          super($r);
          this.listeners = ['missingMethodListener'];
          this.name = 'FaultyComponent'
        }
        // no onMissingMethodListener
      }
      const faultyComp = new FaultyComponent(mock$root);
      // initDOMListeners would throw, so we test removeDOMListeners in isolation
      // assuming listeners array might be out of sync or method was removed
      faultyComp.removeDOMListeners(); // Should not throw
      expect(mock$root.off).not.toHaveBeenCalled(); // Because this.onMissingMethodListener would be undefined
    });
  });
});
