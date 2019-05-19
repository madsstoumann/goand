/**
 * Dialog module.
 * @module /assets/js/dialog
 * @requires /assets/js/common
 * @version 0.9.1
 * @author Mads Stoumann
 * @description Custom versions of alert, confirm and prompt, using <dialog>
 */

import { h, uuid } from './common.mjs';

export default class Dialog {
  constructor(settings = {}) {
    this.settings = Object.assign(
      {
        accept: 'OK',
        cancel: 'Cancel',
        header: '',
        hideCancel: false,
        message: '',
        modifier: '',
        template: '',
        value: '',
        clsAccept: 'c-dialog__accept',
        clsCancel: 'c-dialog__cancel',
        clsDialog: 'c-dialog',
        clsHeader: 'c-dialog__header',
        clsInput: 'c-dialog__input c-field__input',
        clsMessage: 'c-dialog__message',
        clsNav: 'c-dialog__nav',
        clsNoSupport: 'c-dialog--nosupport'
      },
      settings
    );
    this.init();
  }

  /**
   * @function accept
   * @description Accept and close dialog
   * @returns String | Boolean
   */
  accept() {
    return this.input.value || true;
  }

  /**
   * @function cancel
   * @description Cancel and close dialog
   * @returns Boolean
   */
  cancel() {
    return false;
  }

  /**
   * @function init
   * @description Init dialog, create elements and structure
   */
  init() {
    this.dialogSupported = typeof HTMLDialogElement === 'function';
    if (!this.dialogSupported) {
      this.settings.clsDialog += ` ${this.settings.clsNoSupport}`;
    }

    /* Create elements */
    this.acceptBtn = h('button', {
      autofocus: 'autofocus',
      class: this.settings.clsAccept,
      type: 'button'
    });
    this.cancelBtn = h('button', {
      class: this.settings.clsCancel,
      type: 'button'
    });
    this.dialog = h('dialog', {
      class: this.settings.clsDialog,
      id: uuid()
    });
    this.header = h('header', {
      class: this.settings.clsHeader
    });
    this.input = h('input', {
      class: this.settings.clsInput,
      type: 'text'
    });
    this.message = h('p', {
      class: this.settings.clsMessage
    });
    this.nav = h('nav', {
      class: this.settings.clsNav
    });

    /* Create structure */
    this.dialog.appendChild(this.header);
    this.dialog.appendChild(this.message);
    this.dialog.appendChild(this.input);
    this.dialog.appendChild(this.nav);
    this.nav.appendChild(this.cancelBtn);
    this.nav.appendChild(this.acceptBtn);
    document.body.appendChild(this.dialog);

    if (!this.dialogSupported) {
      this.dialog.hidden = true;
      document.body.addEventListener('keyup', event => {
        if (event.key === 'Escape') {
          this.cancelBtn.click();
        }
      });
    }
  }

  /**
   * @function show
   * @param {Object} settings
   * @description Show dialog
   */
  show(settings = {}) {
    const dialog = Object.assign(
      {
        accept: this.settings.accept,
        alert: this.settings.alert,
        cancel: this.settings.cancel,
        header: this.settings.header,
        hideCancel: this.settings.hideCancel,
        message: this.settings.message,
        modifier: this.settings.modifier,
        template: this.settings.template,
        value: this.settings.value
      },
      settings
    );
    this.acceptBtn.innerText = dialog.accept;
    this.cancelBtn.innerText = dialog.cancel;
    this.cancelBtn.hidden = dialog.hideCancel;
    this.dialog.className = `${this.settings.clsDialog} ${dialog.modifier}`;
    this.header.innerText = dialog.header;
    this.input.value = dialog.value;
    this.input.hidden = this.input.value === '';
    this.message.innerHTML = dialog.message + dialog.template;

    if (this.dialogSupported) {
      this.dialog.showModal();
    } else {
      this.dialog.hidden = false;
    }

    return new Promise((resolve, reject) => {
      const parent = this;
      try {
        this.acceptBtn.addEventListener('click', function bindAccept() {
          parent.acceptBtn.removeEventListener('click', bindAccept);
          resolve(parent.accept());
        });
        this.cancelBtn.addEventListener('click', function bindCancel() {
          parent.cancelBtn.removeEventListener('click', bindCancel);
          reject(parent.cancel());
        });
      } catch (error) {
        reject(parent.cancel());
      }
    })
      .catch(() => {
        return false;
      })
      .finally(() => {
        if (this.dialogSupported) {
          this.dialog.close();
        } else {
          this.dialog.hidden = true;
        }
      });
  }
}
