import OtText from 'ot-text-unicode'
import Rope from 'jumprope'

const { makeType, insert, remove } = OtText

const myRopeFns = {
  create (str) { return new Rope(str) },
  toString (rope) { return rope.toString() },
  slice: (str, start, end) => str.slice(start, end),
  builder (rope) {
    // Used for applying operations
    let pos = 0 // character position in unicode code points

    return {
      skip (n) { pos += n },

      append (s) { // Insert s at the current position
        rope.insert(pos, s)
        pos += s.length // in ASCII, no need to find unicode position. TODO: where to get unicodeLength?
      },

      del (n) { // Delete n characters at the current position
        rope.del(pos, n)
      },

      build () { // Finish!
        return rope
      }
    }
  }
}

const RopeType = makeType(myRopeFns)

export class OTDoc {
  constructor (dir = 'left') {
    this.type = RopeType.create()
    this.dir = dir
    /**
     * applied operations to this document.
     */
    this.ops = []
  }

  setInitialContent (text) {
    const op = insert(0, text)
    RopeType.apply(this.type, op)
  }

  insert (index, text) {
    const op = insert(index, text)
    RopeType.apply(this.type, op)
    this.ops.push(op)
  }

  delete (index, length) {
    const op = remove(index, length)
    RopeType.apply(this.type, op)
    this.ops.push(op)
  }

  mergeHistory () {
    let merged = []
    for (let i = 0; i < this.ops.length; i++) {
      merged = RopeType.compose(merged, this.ops[i])
    }
    this.ops = [merged]
  }

  transformOpsAndApply (ops) {
    for (let i = 0; i < ops.length; i++) {
      let theirOp = ops[i]
      for (let j = 0; j < this.ops.length; j++) {
        const myOp = ops[j]
        theirOp = RopeType.transform(theirOp, myOp, /** @type {any} */ (this.dir))
      }
      // @todo [B2.3] thrown an out-of-index error although this benchmark only uses ascii characters
      // RopeType.apply(this.type, theirOp) // <= this should work
      RopeType.apply(this.type, ops[i]) // instead apply untransformed op
    }
  }

  applyOp (op) {
    RopeType.apply(this.type, op)
  }

  updatesLen () {
    return JSON.stringify(this.ops).length
  }

  docSize () {
    return JSON.stringify(insert(0, this.docContent())).length
  }

  docContent () {
    return this.type.toString()
  }
}
