

import { AbstractCrdt, CrdtFactory } from '../../js-lib/index.js' // eslint-disable-line
import { Loro } from 'loro-crdt'

export const name = 'loro'

/**
 * @implements {CrdtFactory}
 */
export class LoroFactory {
  /**
   * @param {function(Uint8Array):void} [updateHandler]
   */
  create(updateHandler) {
    return new LoroWasm(updateHandler)
  }

  /**
 * @param {function(Uint8Array):void} [updateHandler]
 * @param {Uint8Array} [bin]
 * @return {AbstractCrdt}
 */
  load(updateHandler, bin) {
    const doc = new LoroWasm(updateHandler);
    bin && doc.doc.import(bin);
    return doc
  }

  getName() {
    return name
  }
}

/**
 * @implements {AbstractCrdt}
 */
export class LoroWasm {
  /**
   * @param {function(Uint8Array):void} [updateHandler]
   */
  constructor(updateHandler) {
    this.doc = new Loro();
    this.version = undefined;
    this.updateHandler = updateHandler;
    this.list = this.doc.getList('list')
    this.map = this.doc.getMap('map')
    this.text = this.doc.getText('text')
    this.cachedUpdates = [];
  }

  update() {
    if (this.updateHandler) {
      this.updateHandler(this.doc.exportFrom(this.version));
      this.version = this.doc.version();
    }
  }

  /**
   * @return {Uint8Array|string}
   */
  getEncodedState() {
    const ans = this.doc.exportSnapshot()
    // this.doc.diagnoseOplogSize();
    return ans;
  }

  /**
   * @param {Uint8Array} update
   */
  applyUpdate(update) {
    if (this.inTransact) {
      this.cachedUpdates.push(update);
    } else {
      this.doc.import(update)
    }
  }

  /**
   * Insert several items into the internal shared array implementation.
   *
   * @param {number} index
   * @param {Array<any>} elems
   */
  insertArray(index, elems) {
    for (let i = 0; i < elems.length; i++) {
      this.list.insert(index + i, elems[i])
    }
    this.update()
  }

  /**
   * Delete several items into the internal shared array implementation.
   *
   * @param {number} index
   * @param {number} len
   */
  deleteArray(index, len) {
    this.list.delete(index, len);
    this.update()
  }

  /**
   * @return {Array<any>}
   */
  getArray() {
    return this.list.toArray()
  }

  /**
   * Insert text into the internal shared text implementation.
   *
   * @param {number} index
   * @param {string} text
   */
  insertText(index, text) {
    this.text.insert(index, text);
    this.update()
  }

  /**
   * Delete text from the internal shared text implementation.
   *
   * @param {number} index
   * @param {number} len
   */
  deleteText(index, len) {
    this.text.delete(index, len);
    this.update()
  }

  /**
   * @return {string}
   */
  getText() {
    return this.text.toString()
  }

  /**
   * @param {function (AbstractCrdt): void} f
   */
  transact(f) {
    this.cachedUpdates.length = 0;
    this.inTransact = true;
    try {
      f(this)
    } finally {
      this.inTransact = false;
      if (this.cachedUpdates) {
        this.doc.importUpdateBatch(this.cachedUpdates);
        this.cachedUpdates = [];
      }
    }
  }

  /**
   * @param {string} key
   * @param {any} val
   */
  setMap(key, val) {
    this.map.set(key, val);
    this.update();
  }

  /**
   * @return {Map<string,any> | Object<string, any>}
   */
  getMap() {
    return this.map.toJson()
  }
}
