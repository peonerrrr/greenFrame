import { ExcelComponent } from './ExcelComponent';
import { DomListener } from './DomListener'; // Import to spy on its prototype

// Mock for $root, needed for ExcelComponent constructor
// ExcelComponent calls super($root), which is DomListener's constructor.
// DomListener constructor expects $root to be an object.
const mock$root = {
  // We don't need $root.on or $root.off for these tests,
  // as we are mocking initDOMListeners/removeDOMListeners from DomListener.
  // If DomListener's constructor did more with $root, we'd mock that.
};

describe('ExcelComponent', () => {
  let component;
  let options;
  let initDOMListenersSpy;
  let removeDOMListenersSpy;

  beforeEach(() => {
    // Spy on DomListener prototype methods BEFORE any ExcelComponent instance is created
    // and provide a mock implementation to prevent original from running.
    initDOMListenersSpy = jest.spyOn(DomListener.prototype, 'initDOMListeners').mockImplementation(jest.fn());
    removeDOMListenersSpy = jest.spyOn(DomListener.prototype, 'removeDOMListeners').mockImplementation(jest.fn());

    options = {
      name: 'TestExcelComponent',
      emitter: {
        emit: jest.fn(),
        subscribe: jest.fn(),
      },
      listeners: ['click'] // Listeners are used by DomListener's methods
    };
    
    // Now, when ExcelComponent is created, it will use the spied-upon methods
    // from DomListener's prototype for initDOMListeners and removeDOMListeners.
    component = new ExcelComponent(mock$root, options);
  });

  afterEach(() => {
    // Restore the original methods to avoid interference between tests
    initDOMListenersSpy.mockRestore();
    removeDOMListenersSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(ExcelComponent).toBeDefined();
  });

  it('constructor should correctly assign name, emitter, and listeners', () => {
    expect(component.name).toBe(options.name);
    expect(component.emitter).toBe(options.emitter);
    expect(component.listeners).toEqual(options.listeners);
    // Check that $root was passed to DomListener constructor (implicitly tested by not throwing)
    // We can also check if component.$root is set.
    expect(component.$root).toBe(mock$root); 
  });

  it('constructor should default listeners to an empty array if not provided', () => {
    // Need to restore spies temporarily or use a new instance without spies
    initDOMListenersSpy.mockRestore();
    removeDOMListenersSpy.mockRestore();
    const compWithoutListeners = new ExcelComponent(mock$root, { name: 'Test' });
    expect(compWithoutListeners.listeners).toEqual([]);
    // Re-establish spies for other tests if this was not the last one in describe block
    // (though beforeEach handles this)
  });

  it('toHTML should return an empty string by default', () => {
    expect(component.toHTML()).toBe('');
  });

  describe('init', () => {
    it('should call initDOMListeners from DomListener', () => {
      component.init();
      expect(initDOMListenersSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('destroy', () => {
    it('should call removeDOMListeners from DomListener', () => {
      component.destroy();
      expect(removeDOMListenersSpy).toHaveBeenCalledTimes(1);
    });
  });
});
