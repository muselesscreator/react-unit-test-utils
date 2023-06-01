function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
import React from 'react';
import { keyStore } from '../utils';

/**
 * Mock utility for working with useState in a hooks module.
 * Expects/requires an object containing the state object in order to ensure
 * the mock behavior works appropriately.
 *
 * Expected format:
 *   hooks = { state: { <key>: (val) => React.createRef(val), ... } }
 *
 * Returns a utility for mocking useState and providing access to specific state values
 * and setState methods, as well as allowing per-test configuration of useState value returns.
 *
 * Example usage:
 *   // hooks.js
 *   import * as module from './hooks';
 *   import { stateFactory } from '@edx/react-unit-test-utils';
 *
 *   const state = stateFactory([
 *     'isOpen',
 *     'hasDoors',
 *     'selected',
 *   };
 *   ...
 *   export const exampleHook = () => {
 *     const [isOpen, setIsOpen] = module.state.isOpen(false);
 *     const handleClickOpen = () => {
 *       setIsOpen(true);
 *     };
 *     if (!isOpen) { return null; }
 *     return { isOpen, setIsOpen, handleClickOpen };
 *   }
 *   ...
 *
 *   // hooks.test.js
 *   import * as hooks from './hooks';
 *   import { mockUseState } from '@edx/react-unit-test-utils';
 *   const state = mockUseState(hooks)
 *   ...
 *   describe('state hooks', () => {
 *      state.testStateFactory([
 *        state.keys.isOpen,
 *        state.keys.hasDoors,
 *        state.keys.selected,
 *      ]);
 *   });
 *   describe('exampleHook', () => {
 *     let out;
 *     beforeEach(() => {
 *       state.mock();
 *       out = exampleHook();
 *     });
 *     describe('behavior', () => {
 *       it('initializes state hooks', () => {
 *         state.expectInitializedWith(state.keys.isOpen, false);
 *       });
 *     });
 *     describe('output', () => {
 *       it('returns null if isOpen is default value', () => {
 *         expect(out).toEqual(null);
 *       });
 *       describe('if isOpen is not false', () => {
 *         beforeEach(() => {
 *           state.mockVal(state.keys.isOpen, true);
 *           out = exampleHook();
 *         });
 *         it('forwards isOpen and setIsOpen from state hook', () => {
 *           expect(out.isOpen).toEqual(state.values.isOpen);
 *           expect(out.setIsOpen).toEqual(state.setState.isOpen);
 *         });
 *         test('handleClickOpen sets isOpen to true', () => {
 *           out.handleClickOpen();
 *           state.expectSetStateCalledWith(state.keys.isOpen, true);
 *         });
 *       });
 *     });
 *     afterEach(() => { state.restore(); });
 *   });
 *
 * @param {obj} hooks - hooks module containing a 'state' object
 */
export class MockUseState {
  constructor(hooks) {
    this.hooks = hooks;
    this.oldState = null;
    this.setState = {};
    this.values = {};
    this.mock = this.mock.bind(this);
    this.restore = this.restore.bind(this);
    this.mockVal = this.mockVal.bind(this);
  }

  /**
   * @return {object} - keyStore of state object keys
   */
  get keys() {
    return keyStore(this.hooks.state);
  }

  /**
   * Replace the hook module's state object with a mocked version, initialized to default values.
   */
  mock() {
    this.oldState = this.hooks.state;
    Object.keys(this.keys).forEach(key => {
      this.hooks.state[key] = jest.fn(val => {
        this.values[key] = val;
        return [val, this.setState[key]];
      });
    });
    this.setState = Object.keys(this.keys).reduce((obj, key) => _objectSpread(_objectSpread({}, obj), {}, {
      [key]: jest.fn(val => {
        this.hooks.state[key] = val;
      })
    }), {});
  }

  /**
   * Mock the state getter associated with a single key to return a specific value one time.
   *
   * @param {string} key - state key (from this.keys)
   * @param {any} val - new value to be returned by the useState call.
   */
  mockVal(key, val) {
    this.hooks.state[key].mockReturnValueOnce([val, this.setState[key]]);
  }

  /**
   * Restore the hook module's state object to the actual code.
   */
  restore() {
    this.hooks.state = this.oldState;
  }
  expectInitializedWith(key, value) {
    expect(this.hooks.state[key]).toHaveBeenCalledWith(value);
  }
  expectSetStateCalledWith(key, value) {
    expect(this.setState[key]).toHaveBeenCalledWith(value);
  }

  /**
   * Verify that the configured state factory contains the provided fields, irrespective of order.
   * @param {string[]} fields - list of state fields to validate
   */
  testStateFactory(fields) {
    fields.forEach(field => {
      const testValue = 'some value';
      const useState = val => ({
        useState: val
      });
      test(`${field} state getter should return stateFactory output`, () => {
        jest.spyOn(React, 'useState').mockImplementationOnce(useState);
        expect(this.hooks.state[field](testValue)).toEqual(useState(testValue));
      });
    });
  }
}
export const mockUseState = hooks => new MockUseState(hooks);
export default mockUseState;
//# sourceMappingURL=mockUseState.js.map