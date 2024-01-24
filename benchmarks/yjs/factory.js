
import { AbstractCrdt, CrdtFactory } from '../../js-lib/index.js' // eslint-disable-line
import * as Y from 'yjs'

export const name = 'yjs'

/**
 * @implements {CrdtFactory}
 */
export class YjsFactory {
  /**
   * @param {function(Uint8Array):void} updateHandler
   */
  create (updateHandler) {
    return new YjsCRDT(updateHandler)
  }

  /**
   * @param {function(Uint8Array):void} updateHandler
   * @param {Uint8Array} bin
   * @return {AbstractCrdt}
   */
  load (updateHandler, bin) {
    const crdt = new YjsCRDT(updateHandler)
    crdt.applyUpdate(bin)
    return crdt
  }

  getName () {
    return name
  }
}

/**
 * @implements {AbstractCrdt}
 */
export class YjsCRDT {
  /**
   * @param {function(Uint8Array):void} updateHandler
   */
  constructor (updateHandler) {
    this.ydoc = new Y.Doc()
    this.ydoc.on('updateV2', update => {
      updateHandler(update)
    })
    this.yarray = this.ydoc.getArray('array')
    this.ymap = this.ydoc.getMap('map')
    this.ytext = this.ydoc.getText('text')
  }

  /**
   * @return {Uint8Array|string}
   */
  getEncodedState () {
    return Y.encodeStateAsUpdateV2(this.ydoc)
  }

  /**
   * @param {Uint8Array} update
   */
  applyUpdate (update) {
    Y.applyUpdateV2(this.ydoc, update)
  }

  /**
   * Insert several items into the internal shared array implementation.
   *
   * @param {number} index
   * @param {Array<any>} elems
   */
  insertArray (index, elems) {
    this.yarray.insert(index, elems)
  }

  /**
   * Delete several items into the internal shared array implementation.
   *
   * @param {number} index
   * @param {number} len
   */
  deleteArray (index, len) {
    this.yarray.delete(index, len)
  }

  /**
   * @return {Array<any>}
   */
  getArray () {
    return this.yarray.toArray()
  }

  /**
   * Insert text into the internal shared text implementation.
   *
   * @param {number} index
   * @param {string} text
   */
  insertText (index, text) {
    this.ytext.insert(index, text)
  }

  /**
   * Delete text from the internal shared text implementation.
   *
   * @param {number} index
   * @param {number} len
   */
  deleteText (index, len) {
    this.ytext.delete(index, len)
  }

  /**
   * @return {string}
   */
  getText () {
    return this.ytext.toString()
  }

  /**
   * @param {function (AbstractCrdt): void} f
   */
  transact (f) {
    this.ydoc.transact(() => f(this))
  }

  /**
   * @param {string} key
   * @param {any} val
   */
  setMap (key, val) {
    this.ymap.set(key, val)
  }

  /**
   * @return {Map<string,any> | Object<string, any>}
   */
  getMap () {
    return this.ymap.toJSON()
  }
}
