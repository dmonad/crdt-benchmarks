
import { AbstractCrdt, CrdtFactory } from '../../js-lib/index.js'; // eslint-disable-line
import * as error from 'lib0/error';
import { ListCrdt, TextCrdt, gzipSync, gunzipSync } from './bundle.js';

export const name = 'list-positions'

/**
 * @implements {CrdtFactory}
 */
export class ListPositionsFactory {
  /**
   * @param {function(Uint8Array|string):void} updateHandler
   */
  create (updateHandler) {
    return new ListPositionsCRDT(updateHandler)
  }

  /**
   * @param {function(Uint8Array):void} updateHandler
   * @param {Uint8Array} bin
   * @return {AbstractCrdt}
   */
  load (updateHandler, bin) {
    // @ts-ignore I believe string messages will work fine.
    const crdt = new ListPositionsCRDT(updateHandler)
    crdt.load(bin)
    return crdt
  }

  getName () {
    return name
  }
}

/**
 * @implements {AbstractCrdt}
 */
export class ListPositionsCRDT {
  /**
   * @param {function(Uint8Array|string):void} updateHandler
   */
  constructor (updateHandler) {
    /** @type {TextCrdt} */
    this.textCrdt = new TextCrdt(msg => {
      // @ts-ignore Modify message object.
      msg.path = "text";
      // Use simple JSON encoding.
      updateHandler(JSON.stringify(msg))
    })
    /** @type {ListCrdt<unknown>} */
    this.arrayCrdt = new ListCrdt(msg => {
      // @ts-ignore Modify message object.
      msg.path = "array";
      // Use simple JSON encoding.
      updateHandler(JSON.stringify(msg))
    })
  }

  /**
   * @return {Uint8Array|string}
   */
  getEncodedState () {
    const savedState = {
      text: this.textCrdt.save(),
      array: this.arrayCrdt.save()
    }
    // Use gzip'd JSON encoding. This trades off load/save time for size.
    // A custom binary encoding would probably give a better tradeoff.
    return gzipSync(new TextEncoder().encode(JSON.stringify(savedState)));
  }

  /**
   * @param {Uint8Array} savedState
   */
  load(savedState) {
    const savedStateObj = JSON.parse(new TextDecoder().decode(gunzipSync(savedState)));
    this.textCrdt.load(savedStateObj.text);
    this.arrayCrdt.load(savedStateObj.array);
  }

  /**
   * @param {string} update
   */
  applyUpdate (update) {
    const message = JSON.parse(update);
    switch (message.path) {
      case "text":
        this.textCrdt.receive(message);
        break;
      case "array":
        this.arrayCrdt.receive(message);
        break;
    }
  }

  /**
   * Insert several items into the internal shared array implementation.
   *
   * @param {number} index
   * @param {Array<any>} elems
   */
  insertArray (index, elems) {
    this.arrayCrdt.insertAt(index, ...elems);
  }

  /**
   * Delete several items into the internal shared array implementation.
   *
   * @param {number} index
   * @param {number} len
   */
  deleteArray (index, len) {
    this.arrayCrdt.deleteAt(index, len);
  }

  /**
   * @return {Array<any>}
   */
  getArray () {
    return this.arrayCrdt.slice();
  }

  /**
   * Insert text into the internal shared text implementation.
   *
   * @param {number} index
   * @param {string} text
   */
  insertText (index, text) {
    this.textCrdt.insertAt(index, text);
  }

  /**
   * Delete text from the internal shared text implementation.
   *
   * @param {number} index
   * @param {number} len
   */
  deleteText (index, len) {
    this.textCrdt.deleteAt(index, len);
  }

  /**
   * @return {string}
   */
  getText () {
    return this.textCrdt.toString()
  }

  /**
   * @param {function (AbstractCrdt): void} f
   */
  transact (f) {
    f(this);
  }

  /**
   * @param {string} key
   * @param {any} val
   */
  setMap (key, val) {
    error.methodUnimplemented()
  }

  /**
   * @return {Map<string,any> | Object<string, any>}
   */
  getMap () {
    error.methodUnimplemented()
  }
}
