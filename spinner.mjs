/**
 * Spinner
 * @module /spinner.mjs
 * @version 0.9.0
 * @author Mads Stoumann
 * @description Spinner, that can be a ttached to a DOM-node
 */

import { h } from './common.mjs';
export default class Spinner {
  constructor(settings) {
    this.settings = Object.assign(
      {
        class: 'c-spinner__circle',
        classText: 'c-spinner__text',
        console: false,
        target: 'body',
        text: 'Loading content. Do not refresh the page.'
      },
      settings
    );

    this.show = this.spin.bind(this);
    this.spinner = h(
      'div',
      {
        'aria-hidden': true,
        'aria-label': this.settings.text,
        'aria-live': 'polite',
        class: this.settings.class,
        role: 'status'
      },
      [h('div', { class: this.settings.classText })]
    );
    // this.spinner.hidden = true;
    this.target = document.querySelector(this.settings.target);

    if (this.target) {
      this.target.appendChild(this.spinner);
    }
    console.info(this);
  }

  /**
   * @function show
   * @param {Boolean} bool
   * @description Show/hides spinner
   */
  spin(bool) {
    this.spinner.setAttribute('aria-hidden', !bool);
    // this.spinner.hidden = !bool;
    if (bool) {
      if (this.settings.console) {
        console.log(
          '%c Spinner %c ON ',
          'background:#333333; padding: 1px; color: #fff',
          'background:#2e7d32; padding: 1px; color: #fff'
        );
      }
    } else {
      if (this.settings.console) {
        console.log(
          '%c Spinner %c OFF ',
          'background:#333333; padding: 1px; color: #fff',
          'background:#e60032; padding: 1px; color: #fff'
        );
      }
    }
  }
}