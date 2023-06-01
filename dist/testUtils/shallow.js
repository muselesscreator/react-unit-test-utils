const _excluded = ["children"],
  _excluded2 = ["children"];
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { isFragment, isLazy, isPortal, isMemo, isSuspense, isForwardRef } from 'react-is';
import ElementExplorer from './ElementExplorer';
const getNodeName = node => node.displayName || node.name || '';
class ReactShallowRenderer {
  constructor(children) {
    let {
      Wrapper = null
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _defineProperty(this, "shallowRenderer", null);
    this.shallowRenderer = new ShallowRenderer();
    this.shallowWrapper = Wrapper ? this.shallowRenderer.render( /*#__PURE__*/React.createElement(Wrapper, null, children)) : this.shallowRenderer.render(children);
  }
  isEmptyRender() {
    const data = this.getRenderOutput();
    console.log(data);
    return data === null;
  }
  get snapshot() {
    return this.getRenderOutput(true);
  }
  get instance() {
    return new ElementExplorer(this.getRenderOutput());
  }
  extractType(node) {
    if (typeof node === 'string') {
      return node;
    }
    const name = getNodeName(node.type) || node.type || 'Component';
    if (isLazy(node)) {
      return 'Lazy';
    }
    if (isMemo(node)) {
      return `Memo(${name || this.extractType(node.type)})`;
    }
    if (isSuspense(node)) {
      return 'Suspense';
    }
    if (isPortal(node)) {
      return 'Portal';
    }
    if (isFragment(node)) {
      return 'Fragment';
    }
    if (isForwardRef(node)) {
      return this.getWrappedName(node, node.type.render, 'ForwardRef');
    }
    return name;
  }
  getWrappedName(outerNode, innerNode, wrapperName) {
    const functionName = getNodeName(innerNode);
    return outerNode.type.displayName || (functionName !== '' ? `${wrapperName}(${functionName})` : wrapperName);
  }
  getRenderOutput() {
    let render = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (!this.shallowWrapper) {
      return this.shallowWrapper;
    }
    return this.transformNode(this.shallowWrapper, render);
  }

  // eslint-disable-next-line
  extractProps() {
    let _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let key = arguments.length > 1 ? arguments[1] : undefined;
    let render = arguments.length > 2 ? arguments[2] : undefined;
    let {
        children
      } = _ref,
      props = _objectWithoutProperties(_ref, _excluded);
    const childrenArray = Array.isArray(children) ? children : [children];
    return {
      children: childrenArray.filter(Boolean).flatMap(node => this.transformNode(node, render)),
      props: _objectSpread(_objectSpread({}, props), key ? {
        key
      } : {})
    };
  }
  transformNode(node, render) {
    if (Array.isArray(node)) {
      return node.map(n => this.transformNode(n, render));
    }
    if (typeof node !== 'object') {
      return node;
    }
    const out = _objectSpread({
      type: this.extractType(node)
    }, this.extractProps(node.props, node.key, render));
    if (render) {
      // this symbol is used by Jest to prettify serialized React test objects:
      // https://github.com/facebook/jest/blob/e0b33b74b5afd738edc183858b5c34053cfc26dd/packages/pretty-format/src/plugins/ReactTestComponent.ts
      out.$$typeof = Symbol.for('react.test.json');
    }
    return out;
  }
}
export default (Component => {
  let out;
  try {
    out = new ReactShallowRenderer(Component);
  } catch (error) {
    const loadEl = toLoad => {
      if (typeof toLoad === 'object') {
        const _toLoad$props = toLoad.props,
          {
            children
          } = _toLoad$props,
          props = _objectWithoutProperties(_toLoad$props, _excluded2);
        return {
          type: toLoad.type,
          props,
          children: Array.isArray(children) ? children.map(loadEl) : [loadEl(children)]
        };
      }
      // custom return for basic jsx components (mostly for shallow comparison)
      return {
        el: toLoad,
        type: null,
        props: {},
        children: []
      };
    };
    out = {
      data: loadEl(Component)
    };
  }
  return out;
});
//# sourceMappingURL=shallow.js.map