
import { AbstractCrdt, CrdtFactory } from '../../js-lib/index.js' // eslint-disable-line
import * as Y from 'ywasm'

export const name = 'ywasm'

/**
 * @implements {CrdtFactory}
 */
export class YwasmFactory {
  /**
   * @param {function(Uint8Array):void} updateHandler
   */
  create (updateHandler) {
    return new YwasmCRDT(updateHandler)
  }

  /**
   * @param {function(Uint8Array):void} updateHandler
   * @param {Uint8Array} bin
   * @return {AbstractCrdt}
   */
  load (updateHandler, bin) {
    const crdt = new YwasmCRDT(updateHandler)
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
export class YwasmCRDT {
  /**
   * @param {function(Uint8Array):void} updateHandler
   */
  constructor (updateHandler) {
    this.ydoc = new Y.YDoc({})
    this.ydoc.onUpdateV2(/** @param {Uint8Array} update */ update => {
      updateHandler(update)
    })
    this.yarray = this.ydoc.getArray('array')
    this.ymap = this.ydoc.getMap('map')
    this.ytext = this.ydoc.getText('text')
    /**
     * @type {Y.YTransaction | null}
     */
    this.txn = null
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
    this.transact(() => {
      const txn = /** @type {Y.YTransaction} */ (this.txn)
      txn.applyV2(update)
    })
  }

  /**
   * Insert several items into the internal shared array implementation.
   *
   * @param {number} index
   * @param {Array<any>} elems
   */
  insertArray (index, elems) {
    this.transact(() => this.yarray.insert(index, elems, this.txn))
  }

  /**
   * Delete several items into the internal shared array implementation.
   *
   * @param {number} index
   * @param {number} len
   */
  deleteArray (index, len) {
    this.transact(() => this.yarray.delete(index, len, this.txn))
  }

  /**
   * @return {Array<any>}
   */
  getArray () {
    return this.yarray.toJson()
  }

  /**
   * Insert text into the internal shared text implementation.
   *
   * @param {number} index
   * @param {string} text
   */
  insertText (index, text) {
    this.transact(() => this.ytext.insert(index, text, null, this.txn))
  }

  /**
   * Delete text from the internal shared text implementation.
   *
   * @param {number} index
   * @param {number} len
   */
  deleteText (index, len) {
    this.transact(() => this.ytext.delete(index, len, this.txn))
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
    if (this.txn != null) {
      // use current transaction
      f(this)
    } else {
      this.txn = this.ydoc.writeTransaction(null)
      try {
        f(this)
      } finally {
        this.txn.free()
        this.txn = null
      }
    }
  }

  /**
   * @param {string} key
   * @param {any} val
   */
  setMap (key, val) {
    this.transact(() => this.ymap.set(key, val, this.txn))
  }

  /**
   * @return {Map<string,any> | Object<string, any>}
   */
  getMap () {
    return this.ymap.toJson()
  }
}
