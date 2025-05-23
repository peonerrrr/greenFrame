import { Formula } from './Formula'; // Adjust path as necessary
import { $ } from '../../core/dom'; // We need $ to create a mock $root

// Mock ExcelComponent's constructor and methods if needed,
// but for Formula, we're testing its own logic + interaction with DomListener via super.
// So, we primarily need to ensure DomListener's methods are callable.

describe('Formula Component', () => {
  let component;
  let mock$root;
  let mockEmitter;

  beforeEach(() => {
    // Create a mock DOM element for $root, as Formula expects it
    const rootElement = document.createElement('div');
    // Formula's toHTML() creates specific child elements.
    // We need to ensure these exist if onInput/onClick try to access event.target.
    rootElement.innerHTML = `
      <div class="info">fx</div>
      <div class="input" contenteditable spellcheck="false"></div>
    `;
    mock$root = $(rootElement); // Wrap with your $ utility

    mockEmitter = {
      emit: jest.fn(),
      subscribe: jest.fn(),
    };

    // Spy on the methods we expect to be called
    // We can spy on the prototype if they are not arrow functions / not bound in constructor
    // Or, spy on instance methods after creation if they are bound.
    // Formula's onInput and onClick are regular methods.
    jest.spyOn(Formula.prototype, 'onInput');
    jest.spyOn(Formula.prototype, 'onClick');
    jest.spyOn(console, 'log').mockImplementation(() => {}); // Suppress console.log for tests

    component = new Formula(mock$root, { emitter: mockEmitter });
    // init() calls initDOMListeners, which sets up the event listeners
    component.init(); 
  });

  afterEach(() => {
    // Restore any spied-upon methods and console.log
    Formula.prototype.onInput.mockRestore();
    Formula.prototype.onClick.mockRestore();
    console.log.mockRestore();
    // Clean up DOM if necessary (though mock$root is local to beforeEach)
  });

  it('should be defined', () => {
    expect(Formula).toBeDefined();
  });

  it('should call onInput when an input event is dispatched on the input element', () => {
    const inputElement = mock$root.$el.querySelector('.input');
    expect(inputElement).not.toBeNull();

    // Simulate an input event
    const event = new Event('input', { bubbles: true, cancelable: true });
    // Simulate text content for event.target.textContent.trim()
    inputElement.textContent = 'test input '; 
    inputElement.dispatchEvent(event);

    // Assert against the spy on the prototype method
    expect(Formula.prototype.onInput).toHaveBeenCalledTimes(1);
    expect(Formula.prototype.onInput).toHaveBeenCalledWith(expect.objectContaining({ type: 'input' }));
    // Check console.log if needed (it's mocked, so check mock calls)
    expect(console.log).toHaveBeenCalledWith('Formula', 'onInput', 'test input');
  });

  it('should call onClick when a click event is dispatched on the root (or specific element if targeted)', () => {
    // For this test, let's assume onClick is generic and listens on $root or a child.
    // Formula's listeners are ['input', 'click']. Click is on $root.
    
    // Simulate a click event on the root element itself
    const event = new MouseEvent('click', { bubbles: true });
    mock$root.$el.dispatchEvent(event); // Dispatch on the actual DOM node

    // Assert against the spy on the prototype method
    expect(Formula.prototype.onClick).toHaveBeenCalledTimes(1);
    expect(Formula.prototype.onClick).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }));
    expect(console.log).toHaveBeenCalledWith('Formula', 'onClick', expect.any(MouseEvent));
  });
  
  it('toHTML should render correctly', () => {
    const html = component.toHTML();
    expect(html).toContain('<div class="info">fx</div>');
    expect(html).toContain('<div class="input" contenteditable spellcheck="false"></div>');
  });

  it('constructor should set up name and listeners for ExcelComponent', () => {
    // Accessing private/super properties is not direct, but we test the outcome.
    // The fact that initDOMListeners (called by component.init()) correctly
    // sets up 'input' and 'click' listeners (tested by event dispatches)
    // implies that `this.listeners` was correctly passed to DomListener.
    // We can also check the properties if they are public on the instance.
    expect(component.name).toBe('Formula');
    expect(component.listeners).toEqual(['input', 'click']);
  });
});
