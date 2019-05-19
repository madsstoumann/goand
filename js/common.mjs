/**
 * @function h
 * @param {String} type
 * @param {Array | Object} attributes
 * @param {Array} [children]
 * @description DOM-factory
 * @returns Node
 */
export function h(type, attributes, children = []) {
  const element = document.createElement(type);
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  if (children.length) {
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
  }
  return element;
}

/**
 * @function uuid
 * @description DOM-factory
 * @returns String
 */
export function uuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
