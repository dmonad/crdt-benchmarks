
import { AbstractCrdt, CrdtFactory } from '../../js-lib/index.js' // eslint-disable-line
import { Loro } from 'loro-crdt'

export const name = 'loro'

/**
 * @implements {CrdtFactory}
 */
export class LoroFactory {
  /**
   * @param {function(Uint8Array):void} updateHandler
   */
  create (updateHandler) {
    return new LoroWasm(updateHandler)
  }

  /**
 * @param {function(Uint8Array):void} updateHandler
 * @param {Uint8Array} [bin]
 * @return {AbstractCrdt}
 */
  load (updateHandler, bin) {
    const doc = new LoroWasm(updateHandler)
    bin && doc.doc.import(bin)
    return doc
  }

  getName () {
    return name
  }
}

/**
 * @implements {AbstractCrdt}
 */
export class LoroWasm {
  /**
   * @param {function(Uint8Array):void} updateHandler
   */
  constructor (updateHandler) {
    this.doc = new Loro()
    this.version = undefined
    this.updateHandler = updateHandler
    this.list = this.doc.getList('list')
    this.map = this.doc.getMap('map')
    this.text = this.doc.getText('text')
    /**
     * Cached updates will be applied at the end of the transaction.
     *
     * @type {Array<Uint8Array>}
     */
    this.cachedUpdates = []
  }

  /**
   * @return {Uint8Array|string}
   */
  getEncodedState () {
    /**
     * Snapshots store the operation log AND the encoded in-memory state of the document. It has
     * faster loading time,  but the encoded document is larger and it takes longer
     * to encode.
     *
     * Normal updates only store the operation log. They take longer to decode.
     *
     * We use the snapshot feature by default, as this is what the Loro team recommends.
     */
    return this.doc.exportSnapshot() // use the snapshot format
    // return this.doc.exportFrom() // use the update format
  }

  /**
   * @param {Uint8Array} update
   */
  applyUpdate (update) {
    if (this.inTransact) {
      this.cachedUpdates.push(update)
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
  insertArray (index, elems) {
    this.transact(() => {
      for (let i = 0; i < elems.length; i++) {
        this.list.insert(index + i, elems[i])
      }
    })
  }

  /**
   * Delete several items into the internal shared array implementation.
   *
   * @param {number} index
   * @param {number} len
   */
  deleteArray (index, len) {
    this.transact(() => {
      this.list.delete(index, len)
    })
  }

  /**
   * @return {Array<any>}
   */
  getArray () {
    return this.list.toArray()
  }

  /**
   * Insert text into the internal shared text implementation.
   *
   * @param {number} index
   * @param {string} text
   */
  insertText (index, text) {
    this.transact(() => {
      this.text.insert(index, text)
    })
  }

  /**
   * Delete text from the internal shared text implementation.
   *
   * @param {number} index
   * @param {number} len
   */
  deleteText (index, len) {
    this.transact(() => {
      this.text.delete(index, len)
    })
  }

  /**
   * @return {string}
   */
  getText () {
    return this.text.toString()
  }

  /**
   * @param {function (AbstractCrdt): void} f
   */
  transact (f) {
    if (this.inTransact) {
      f(this)
      return
    }
    this.inTransact = true
    f(this)
    if (this.cachedUpdates.length > 0) {
      this.doc.importUpdateBatch(this.cachedUpdates)
      this.cachedUpdates = []
    }
    this.updateHandler(this.doc.exportFrom(this.version))
    this.version = this.doc.version()
    this.inTransact = false
  }

  /**
   * @param {string} key
   * @param {any} val
   */
  setMap (key, val) {
    this.transact(() => {
      this.map.set(key, val)
    })
  }

  /**
   * @return {Map<string,any> | Object<string, any>}
   */
  getMap () {
    return this.map.toJson()
  }
}
