import { $ } from './dom'; // Assuming your $ function is exported from dom.js

describe('Dom', () => {
  let $div;

  beforeEach(() => {
    // Create a fresh div element for each test and append it to the document body
    // This ensures a clean environment for event testing.
    // JSDOM (Jest's default environment) will provide `document`.
    const div = document.createElement('div');
    document.body.appendChild(div);
    $div = $(div); // Wrap it with your Dom utility
  });

  afterEach(() => {
    // Clean up by removing the element from the body
    if ($div && $div.$el && $div.$el.parentNode) {
      $div.$el.parentNode.removeChild($div.$el);
    }
    $div = null; 
  });

  it('should be defined', () => {
    expect($).toBeDefined();
  });

  describe('on() and off()', () => {
    it('should add an event listener with on() and callback should be called', () => {
      const callback = jest.fn();
      $div.on('click', callback);

      // Create a click event and dispatch it
      const event = new MouseEvent('click', { bubbles: true });
      $div.$el.dispatchEvent(event);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(expect.any(MouseEvent));
    });

    it('should remove an event listener with off() and callback should not be called', () => {
      const callback = jest.fn();
      $div.on('click', callback);
      $div.off('click', callback);

      const event = new MouseEvent('click', { bubbles: true });
      $div.$el.dispatchEvent(event);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should correctly handle multiple listeners for the same event', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      $div.on('click', callback1);
      $div.on('click', callback2);

      const event = new MouseEvent('click', { bubbles: true });
      $div.$el.dispatchEvent(event);

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should correctly remove one of multiple listeners for the same event', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      $div.on('click', callback1);
      $div.on('click', callback2);
      $div.off('click', callback1); // Remove only callback1

      const event = new MouseEvent('click', { bubbles: true });
      $div.$el.dispatchEvent(event);

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  // Basic test for html() method as it's simple
  describe('html()', () => {
    it('should set HTML content', () => {
      $div.html('<p>Hello</p>');
      expect($div.$el.innerHTML).toBe('<p>Hello</p>');
    });

    it('should get HTML content', () => {
      $div.$el.innerHTML = '<span>World</span>';
      // Note: .html() returns outerHTML, so we compare accordingly
      expect($div.html()).toBe('<div><span>World</span></div>');
    });
  });
  
  // Basic test for append()
  describe('append()', () => {
    it('should append a DOM node', () => {
      const p = document.createElement('p');
      $div.append(p);
      expect($div.$el.contains(p)).toBe(true);
    });

    it('should append a Dom instance', () => {
      const $p = $.create('p', 'my-paragraph');
      $div.append($p);
      expect($div.$el.contains($p.$el)).toBe(true);
      expect($div.$el.querySelector('.my-paragraph')).not.toBeNull();
    });
  });
});
