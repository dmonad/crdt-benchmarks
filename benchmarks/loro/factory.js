
import { AbstractCrdt, CrdtFactory } from '../../js-lib/index.js' // eslint-disable-line
import * as loro from 'loro-crdt'

export const name = 'loro'

/**
 * @implements {CrdtFactory}
 */
export class LoroFactory {
  /**
   * @param {function(Uint8Array):void} [updateHandler]
   */
  create (updateHandler) {
    return new LoroCRDT(updateHandler)
  }

  /**
   * @param {function(Uint8Array):void} [updateHandler]
   * @param {Uint8Array} bin
   * @return {AbstractCrdt}
   */
  load (updateHandler, bin) {
    const crdt = new LoroCRDT(updateHandler)
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
export class LoroCRDT {
  /**
   * @param {function(Uint8Array):void} [updateHandler]
   */
  constructor (updateHandler) {
    this.doc = new loro.Loro()
    this.updateHandler = updateHandler
    this.array = this.doc.getList('list')
    this.map = this.doc.getMap('map')
    this.text = this.doc.getText('text')
    this._tr = false
  }

  /**
   * @return {Uint8Array|string}
   */
  getEncodedState () {
    /**
     * Snapshots store the operation log AND the in-memory representation of the
     * document.
     *
     * Normal updates only store the operation log.
     *
     * We use the update format since this is what would be used in practice. I will update this
     * once it can be shown that there is a loro network backend that uses this feature.
     */
    // return this.doc.exportSnapshot() // use snapshots instead
    return this.doc.exportFrom()
  }

  /**
   * @param {Uint8Array} update
   */
  applyUpdate (update) {
    this.doc.import(update)
  }

  /**
   * Insert several items into the internal shared array implementation.
   *
   * @param {number} index
   * @param {Array<any>} elems
   */
  insertArray (index, elems) {
    this.transact(() => {
      elems.forEach((e, i) => {
        this.array.insert(index + i, e)
      })
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
      this.array.delete(index, len)
    })
  }

  /**
   * @return {Array<any>}
   */
  getArray () {
    return this.array.toArray()
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
   * @param {function (AbstractCrdt, loro.Loro): void} f
   */
  transact (f) {
    if (this._tr) {
      f(this, this.doc)
      return
    }
    this._tr = true
    // potentially we could cache version here?
    const version = this.doc.version()
    f(this, this.doc)
    this.doc.commit()
    this._tr = false
    if (this.updateHandler) this.updateHandler(this.doc.exportFrom(version))
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
