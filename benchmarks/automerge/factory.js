import { AbstractCrdt, CrdtFactory } from '../../js-lib/index.js' // eslint-disable-line
import * as automerge from '@automerge/automerge'

const initialDoc = automerge.from({
  array: /** @type {Array<any>} */ ([]),
  map: {},
  text: new automerge.Text()
})

const initialDocBinary = automerge.save(initialDoc)

export const name = 'automerge'

/**
 * @implements {CrdtFactory}
 */
export class AutomergeFactory {
  /**
   * @param {function(Uint8Array):void} [updateHandler]
   */
  create (updateHandler) {
    return new AutomergeCRDT(updateHandler)
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
   * @param {function(Uint8Array):void} [updateHandler]
   */
  constructor (updateHandler) {
    this.updateHandler = updateHandler
    /**
     * @type {typeof initialDoc}
     */
    this.doc = automerge.load(initialDocBinary)
  }

  update () {
    if (this.updateHandler) this.updateHandler(automerge.saveIncremental(this.doc))
  }

  /**
   * @return {Uint8Array|string}
   */
  getEncodedState () {
    return automerge.save(this.doc)
  }

  /**
   * @param {Uint8Array} update
   */
  applyUpdate (update) {
    this.doc = automerge.loadIncremental(this.doc, update)
  }

  /**
   * Insert several items into the internal shared array implementation.
   *
   * @param {number} index
   * @param {Array<any>} elems
   */
  insertArray (index, elems) {
    this.doc = automerge.change(this.doc, d => {
      d.array.splice(index, 0, ...elems)
    })
    this.update()
  }

  /**
   * Delete several items into the internal shared array implementation.
   *
   * @param {number} index
   * @param {number} len
   */
  deleteArray (index, len) {
    this.doc = automerge.change(this.doc, d => {
      d.array.splice(index, len)
    })
    this.update()
  }

  /**
   * @return {Array<any>}
   */
  getArray () {
    return this.doc.array
  }

  /**
   * Insert text into the internal shared text implementation.
   *
   * @param {number} index
   * @param {string} text
   */
  insertText (index, text) {
    this.doc = automerge.change(this.doc, d => {
      d.text.insertAt(index, text)
    })
    this.update()
  }

  /**
   * Delete text from the internal shared text implementation.
   *
   * @param {number} index
   * @param {number} len
   */
  deleteText (index, len) {
    this.doc = automerge.change(this.doc, d => {
      d.text.deleteAt(index, len)
    })
    this.update()
  }

  /**
   * @return {string}
   */
  getText () {
    return this.doc.text.toString()
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
    this.doc = automerge.change(this.doc, d => {
      d.map[key] = val
    })
    this.update()
  }

  /**
   * @return {Map<string,any> | Object<string, any>}
   */
  getMap () {
    return this.doc.map
  }
}
