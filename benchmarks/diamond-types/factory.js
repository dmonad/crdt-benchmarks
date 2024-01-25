
import { AbstractCrdt, CrdtFactory } from '../../js-lib/index.js' // eslint-disable-line
import { OpLog, Doc } from 'diamond-types-node'
import * as random from 'lib0/random'
import * as error from 'lib0/error'

export const name = 'diamond-types'

/**
 * @implements {CrdtFactory}
 */
export class DiamondFactory {
  /**
   * @param {function(Uint8Array):void} updateHandler
   */
  create (updateHandler) {
    return new DiamondCRDT(updateHandler)
  }

  /**
   * @param {function(Uint8Array):void} updateHandler
   * @param {Uint8Array} bin
   * @return {AbstractCrdt}
   */
  load (updateHandler, bin) {
    const crdt = new DiamondCRDT(updateHandler)
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
export class DiamondCRDT {
  /**
   * @param {function(Uint8Array):void} updateHandler
   */
  constructor (updateHandler) {
    this.doc = new Doc('user' + random.uint32())
    this.oplog = new OpLog('user' + random.uint32())
    this.initVersion = this.oplog.getLocalVersion()
    this.version = this.oplog.getLocalVersion()
    this.updateHandler = updateHandler
  }

  /**
   * @return {Uint8Array|string}
   */
  getEncodedState () {
    return this.oplog.toBytes()
  }

  /**
   * @param {Uint8Array} update
   */
  applyUpdate (update) {
    this.transact(() => {
      this.oplog.addFromBytes(update)
    })
  }

  /**
   * Insert several items into the internal shared array implementation.
   *
   * @param {number} index
   * @param {Array<any>} elems
   */
  insertArray (index, elems) {
    error.methodUnimplemented()
  }

  /**
   * Delete several items into the internal shared array implementation.
   *
   * @param {number} index
   * @param {number} len
   */
  deleteArray (index, len) {
    error.methodUnimplemented()
  }

  /**
   * @return {Array<any>}
   */
  getArray () {
    error.methodUnimplemented()
  }

  /**
   * Insert text into the internal shared text implementation.
   *
   * @param {number} index
   * @param {string} text
   */
  insertText (index, text) {
    this.transact(() => {
      this.oplog.ins(index, text)
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
      this.oplog.del(index, len)
    })
  }

  /**
   * @return {string}
   */
  getText () {
    return this.oplog.checkout().get()
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
    this.updateHandler(this.oplog.getPatchSince(this.version))
    /**
     * We want to simulate real-world scenarios. We need to update the UI/Editor somehow. This could
     * be achieved by calculating the ops.
     */
    this.oplog.getOpsSince(this.version)
    this.version = this.oplog.getLocalVersion()
    this.inTransact = false
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
