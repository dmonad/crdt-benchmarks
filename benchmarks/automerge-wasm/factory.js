import { AbstractCrdt, CrdtFactory } from '../../js-lib/index.js' // eslint-disable-line
import * as Automerge from '@automerge/automerge-wasm'

const INITIAL_DOC = Automerge.create()
const ARRAY_ID = INITIAL_DOC.putObject('/', 'array', [])
const MAP_ID = INITIAL_DOC.putObject('/', 'map', {})
const TEXT_ID = INITIAL_DOC.putObject('/', 'text', '')
const INITIAL_DOC_BINARY = INITIAL_DOC.save()

export const name = 'automerge-wasm'

/**
 * @implements {CrdtFactory}
 */
export class AutomergeFactory {
  /**
   * @param {function(Uint8Array):void} updateHandler
   */
  create (updateHandler) {
    return new AutomergeCRDT(updateHandler)
  }

  /**
   * @param {function(Uint8Array):void} updateHandler
   * @param {Uint8Array} bin
   * @return {AbstractCrdt}
   */
  load (updateHandler, bin) {
    return new AutomergeCRDT(updateHandler, bin)
  }

  getName () {
    return name
  }
}

/**
 * @implements {AbstractCrdt}
 */
export class AutomergeCRDT {
  /**
   * @param {function(Uint8Array):void} updateHandler
   * @param {Uint8Array} bin
   */
  constructor (updateHandler, bin = INITIAL_DOC_BINARY) {
    this.updateHandler = updateHandler
    this.doc = Automerge.load(bin)
  }

  update () {
    this.updateHandler(this.doc.saveIncremental())
  }

  /**
   * @return {Uint8Array|string}
   */
  getEncodedState () {
    return this.doc.save()
  }

  /**
   * @param {Uint8Array} update
   */
  applyUpdate (update) {
    this.doc.loadIncremental(update)
  }

  /**
   * Insert several items into the internal shared array implementation.
   *
   * @param {number} index
   * @param {Array<any>} elems
   */
  insertArray (index, elems) {
    this.doc.splice(ARRAY_ID, index, 0, elems)
    this.update()
  }

  /**
   * Delete several items into the internal shared array implementation.
   *
   * @param {number} index
   * @param {number} len
   */
  deleteArray (index, len) {
    this.doc.splice(ARRAY_ID, index, len, [])
    this.update()
  }

  /**
   * @return {Array<any>}
   */
  getArray () {
    return /** @type {any} */ (this.doc.materialize(ARRAY_ID))
  }

  /**
   * Insert text into the internal shared text implementation.
   *
   * @param {number} index
   * @param {string} text
   */
  insertText (index, text) {
    this.doc.splice(TEXT_ID, index, 0, [...text])
    this.update()
  }

  /**
   * Delete text from the internal shared text implementation.
   *
   * @param {number} index
   * @param {number} len
   */
  deleteText (index, len) {
    this.doc.splice(TEXT_ID, index, len, '')
    this.update()
  }

  /**
   * @return {string}
   */
  getText () {
    return this.doc.text(TEXT_ID)
  }

  /**
   * @param {function (AbstractCrdt): void} f
   */
  transact (f) {
    f(this)
  }

  /**
   * @param {string} key
   * @param {any} val
   */
  setMap (key, val) {
    if (typeof val === 'object') {
      this.doc.putObject(MAP_ID, key, val)
    } else {
      this.doc.put(MAP_ID, key, val)
    }
    this.update()
  }

  /**
   * @return {Map<string,any> | Object<string, any>}
   */
  getMap () {
    return /** @type {any} */ (this.doc.materialize(MAP_ID))
  }
}
