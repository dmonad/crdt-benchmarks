
import * as Y from 'yjs'
import { setBenchmarkResult, gen, N, benchmarkTime, disableAutomergeBenchmarks, disableOTBenchmarks, disablePeersCrdtsBenchmarks, disableYjsBenchmarks, logMemoryUsed, getMemUsed, deltaDeleteHelper, deltaInsertHelper } from './utils.js'
import * as prng from 'lib0/prng.js'
import * as math from 'lib0/math.js'
import * as t from 'lib0/testing.js'
import Automerge from 'automerge'
import { insert } from 'ot-text-unicode'
import { OTDoc } from './otHelpers.js'
import DeltaCRDT from 'delta-crdts'
import deltaCodec from 'delta-crdts-msgpack-codec'
const DeltaRGA = DeltaCRDT('rga')

/**
 * Helper function to run a B1 benchmark in Yjs.
 *
 * @template T
 * @param {string} id name of the benchmark e.g. "[B1.1] Description"
 * @param {Array<T>} inputData
 * @param {function(Y.Doc, T, number):void} changeFunction Is called on every element in inputData
 * @param {function(Y.Doc, Y.Doc):void} check Check if the benchmark result is correct (all clients end up with the expected result)
 */
const benchmarkYjs = (id, inputData, changeFunction, check) => {
  const startHeapUsed = getMemUsed()

  if (disableYjsBenchmarks) {
    setBenchmarkResult('yjs', id, 'skipping')
    return
  }

  const doc1 = new Y.Doc()
  const doc2 = new Y.Doc()
  let updateSize = 0
  doc1.on('updateV2', update => {
    updateSize += update.byteLength
    Y.applyUpdateV2(doc2, update, benchmarkYjs)
  })
  benchmarkTime('yjs', `${id} (time)`, () => {
    for (let i = 0; i < inputData.length; i++) {
      changeFunction(doc1, inputData[i], i)
    }
  })
  check(doc1, doc2)
  setBenchmarkResult('yjs', `${id} (avgUpdateSize)`, `${math.round(updateSize / inputData.length)} bytes`)
  const encodedState = Y.encodeStateAsUpdateV2(doc1)
  const documentSize = encodedState.byteLength
  setBenchmarkResult('yjs', `${id} (docSize)`, `${documentSize} bytes`)
  benchmarkTime('yjs', `${id} (parseTime)`, () => {
    const doc = new Y.Doc()
    Y.applyUpdateV2(doc, encodedState)
    logMemoryUsed('yjs', id, startHeapUsed)
  })
}

/**
 * Helper function to run a B1 benchmark in Yjs.
 *
 * @template T
 * @param {string} id name of the benchmark e.g. "[B1.1] Description"
 * @param {Array<T>} inputData
 * @param {function(any, T, number):void} changeFunction Is called on every element in inputData
 * @param {function(any, any):void} check Check if the benchmark result is correct (all clients end up with the expected result)
 */
const benchmarkOT = (id, inputData, changeFunction, check) => {
  const startHeapUsed = getMemUsed()

  if (disableOTBenchmarks) {
    setBenchmarkResult('OT', id, 'skipping')
    return
  }

  const doc1 = new OTDoc('left')
  const doc2 = new OTDoc('right')
  benchmarkTime('OT', `${id} (time)`, () => {
    for (let i = 0; i < inputData.length; i++) {
      changeFunction(doc1, inputData[i], i)
    }
    // here we simulate sending each operation seperately to the other client using JSON encoding
    doc1.ops.forEach(op => {
      doc2.applyOp(JSON.parse(JSON.stringify(op)))
    })
  })
  check(doc1, doc2)
  setBenchmarkResult('OT', `${id} (avgUpdateSize)`, `${math.round(doc1.updatesLen() / inputData.length)} bytes`)
  const encodedState = JSON.stringify(insert(0, doc1.docContent()))
  const documentSize = encodedState.length
  setBenchmarkResult('OT', `${id} (docSize)`, `${documentSize} bytes`)
  benchmarkTime('OT', `${id} (parseTime)`, () => {
    const doc = new OTDoc()
    doc.applyOp(JSON.parse(encodedState))
    logMemoryUsed('OT', id, startHeapUsed)
  })
}

/**
 * Helper function to run a B1 benchmark in delta-crdts.
 *
 * @template T
 * @param {string} id name of the benchmark e.g. "[B1.1] Description"
 * @param {Array<T>} inputData
 * @param {function(any, T, number):Array<ArrayBuffer>} changeFunction Is called on every element in inputData and returns the generated delta
 * @param {function(any, any):void} check Check if the benchmark result is correct (all clients end up with the expected result)
 */
const benchmarkDeltaCrdts = (id, inputData, changeFunction, check) => {
  const startHeapUsed = getMemUsed()

  if (disablePeersCrdtsBenchmarks) {
    setBenchmarkResult('delta-crdts', id, 'skipping')
    return
  }

  const doc1 = DeltaRGA('1')
  const doc2 = DeltaRGA('2')

  let updateSize = 0
  benchmarkTime('delta-crdts', `${id} (time)`, () => {
    for (let i = 0; i < inputData.length; i++) {
      const deltas = changeFunction(doc1, inputData[i], i).map(deltaCodec.encode)
      updateSize += deltas.reduce((size, update) => size + update.byteLength, 0)
      deltas.forEach(delta => {
        doc2.apply(deltaCodec.decode(delta))
      })
    }
  })
  check(doc1, doc2)
  setBenchmarkResult('delta-crdts', `${id} (avgUpdateSize)`, `${math.round(updateSize / inputData.length)} bytes`)
  const encodedState = deltaCodec.encode(doc1.state())
  const documentSize = encodedState.byteLength
  setBenchmarkResult('delta-crdts', `${id} (docSize)`, `${documentSize} bytes`)
  benchmarkTime('delta-crdts', `${id} (parseTime)`, () => {
    const doc3 = DeltaRGA('3')
    doc3.apply(deltaCodec.decode(encodedState))
    logMemoryUsed('delta-crdts', id, startHeapUsed)
  })
}

/**
 * Helper function to run a B1 benchmark in Automerge.
 *
 * @template T
 * @param {string} id name of the benchmark e.g. "[B1.1] Description"
 * @param {Array<T>} inputData
 * @param {function(any, T, number):void} changeFunction Is called on every element in inputData
 * @param {function(any, any):void} check Check if the benchmark result is correct (all clients end up with the expected result)
 */
const benchmarkAutomerge = (id, init, inputData, changeFunction, check) => {
  const startHeapUsed = getMemUsed()
  if (disableAutomergeBenchmarks) {
    setBenchmarkResult('automerge', id, 'skipping')
    return
  }
  const emptyDoc = Automerge.init()
  let doc1 = Automerge.change(emptyDoc, init)
  let doc2 = Automerge.applyChanges(Automerge.init(), Automerge.getChanges(emptyDoc, doc1))
  let updateSize = 0
  benchmarkTime('automerge', `${id} (time)`, () => {
    for (let i = 0; i < inputData.length; i++) {
      const updatedDoc = Automerge.change(doc1, doc => {
        changeFunction(doc, inputData[i], i)
      })
      const update = JSON.stringify(Automerge.getChanges(doc1, updatedDoc))
      updateSize += update.length
      doc2 = Automerge.applyChanges(doc2, JSON.parse(update))
      doc1 = updatedDoc
    }
  })
  check(doc1, doc2)
  setBenchmarkResult('automerge', `${id} (avgUpdateSize)`, `${math.round(updateSize / inputData.length)} bytes`)
  const encodedState = Automerge.save(doc1)
  const documentSize = encodedState.length
  setBenchmarkResult('automerge', `${id} (docSize)`, `${documentSize} bytes`)
  benchmarkTime('automerge', `${id} (parseTime)`, () => {
    Automerge.load(encodedState)
    logMemoryUsed('automerge', id, startHeapUsed)
  })
}

{
  const benchmarkName = '[B1.1] Append N characters'
  const string = prng.word(gen, N, N)
  benchmarkYjs(
    benchmarkName,
    string.split(''),
    (doc, s, i) => { doc.getText('text').insert(i, s) },
    (doc1, doc2) => {
      t.assert(doc1.getText('text').toString() === doc2.getText('text').toString())
      t.assert(doc1.getText('text').toString() === string)
    }
  )
  benchmarkOT(
    benchmarkName,
    string.split(''),
    (doc, s, i) => { doc.insert(i, s) },
    (doc1, doc2) => {
      t.assert(doc1.docContent() === doc2.docContent())
      t.assert(doc1.docContent() === string)
    }
  )
  benchmarkDeltaCrdts(
    benchmarkName,
    string.split(''),
    (doc, s, i) => deltaInsertHelper(doc, i, s),
    (doc1, doc2) => {
      t.assert(doc1.value().join('') === doc2.value().join(''))
      t.assert(doc1.value().join('') === string)
    }
  )
  benchmarkAutomerge(
    benchmarkName,
    doc => { doc.text = new Automerge.Text() },
    string.split(''),
    (doc, s, i) => { doc.text.insertAt(i, s) },
    (doc1, doc2) => {
      t.assert(doc1.text.join('') === doc2.text.join(''))
      t.assert(doc1.text.join('') === string)
    }
  )
}

{
  const benchmarkName = '[B1.2] Insert string of length N'
  const string = prng.word(gen, N, N)
  // B1.1: Insert text from left to right
  benchmarkYjs(
    benchmarkName,
    [string],
    (doc, s, i) => { doc.getText('text').insert(i, s) },
    (doc1, doc2) => {
      t.assert(doc1.getText('text').toString() === doc2.getText('text').toString())
      t.assert(doc1.getText('text').toString() === string)
    }
  )
  benchmarkOT(
    benchmarkName,
    [string],
    (doc, s, i) => { doc.insert(i, s) },
    (doc1, doc2) => {
      t.assert(doc1.docContent() === doc2.docContent())
      t.assert(doc1.docContent() === string)
    }
  )
  benchmarkDeltaCrdts(
    benchmarkName,
    [string],
    (doc, s, i) => deltaInsertHelper(doc, i, s),
    (doc1, doc2) => {
      t.assert(doc1.value().join('') === doc2.value().join(''))
      t.assert(doc1.value().join('') === string)
    }
  )
  benchmarkAutomerge(
    benchmarkName,
    doc => { doc.text = new Automerge.Text() },
    [string],
    (doc, s, i) => { doc.text.insertAt(i, ...s) },
    (doc1, doc2) => {
      t.assert(doc1.text.join('') === doc2.text.join(''))
      t.assert(doc1.text.join('') === string)
    }
  )
}

{
  const benchmarkName = '[B1.3] Prepend N characters'
  const string = prng.word(gen, N, N)
  const reversedString = string.split('').reverse().join('')
  benchmarkYjs(
    benchmarkName,
    reversedString.split(''),
    (doc, s, i) => { doc.getText('text').insert(0, s) },
    (doc1, doc2) => {
      t.assert(doc1.getText('text').toString() === doc2.getText('text').toString())
      t.assert(doc1.getText('text').toString() === string)
    }
  )
  benchmarkOT(
    benchmarkName,
    reversedString.split(''),
    (doc, s, i) => { doc.insert(0, s) },
    (doc1, doc2) => {
      t.assert(doc1.docContent() === doc2.docContent())
      t.assert(doc1.docContent() === string)
    }
  )
  benchmarkDeltaCrdts(
    benchmarkName,
    reversedString.split(''),
    (doc, s, i) => deltaInsertHelper(doc, 0, s),
    (doc1, doc2) => {
      t.assert(doc1.value().join('') === doc2.value().join(''))
      t.assert(doc1.value().join('') === string)
    }
  )
  benchmarkAutomerge(
    benchmarkName,
    doc => { doc.text = new Automerge.Text() },
    reversedString.split(''),
    (doc, s, i) => { doc.text.insertAt(0, s) },
    (doc1, doc2) => {
      t.assert(doc1.text.join('') === doc2.text.join(''))
      t.assert(doc1.text.join('') === string)
    }
  )
}

{
  const benchmarkName = '[B1.4] Insert N characters at random positions'
  // calculate random input
  let string = ''
  const input = []
  for (let i = 0; i < N; i++) {
    const index = prng.int32(gen, 0, string.length)
    const insert = prng.word(gen, 1, 1)
    string = string.slice(0, index) + insert + string.slice(index)
    input.push({ index, insert })
  }
  benchmarkYjs(
    benchmarkName,
    input,
    (doc, op, i) => { doc.getText('text').insert(op.index, op.insert) },
    (doc1, doc2) => {
      t.assert(doc1.getText('text').toString() === doc2.getText('text').toString())
      t.assert(doc1.getText('text').toString() === string)
    }
  )
  benchmarkOT(
    benchmarkName,
    input,
    (doc, op, i) => { doc.insert(op.index, op.insert) },
    (doc1, doc2) => {
      t.assert(doc1.docContent() === doc2.docContent())
      t.assert(doc1.docContent() === string)
    }
  )
  benchmarkDeltaCrdts(
    benchmarkName,
    input,
    (doc, op, i) => deltaInsertHelper(doc, op.index, op.insert),
    (doc1, doc2) => {
      t.assert(doc1.value().join('') === doc2.value().join(''))
      t.assert(doc1.value().join('') === string)
    }
  )
  benchmarkAutomerge(
    benchmarkName,
    doc => { doc.text = new Automerge.Text() },
    input,
    (doc, op, i) => { doc.text.insertAt(op.index, op.insert) },
    (doc1, doc2) => {
      t.assert(doc1.text.join('') === doc2.text.join(''))
      t.assert(doc1.text.join('') === string)
    }
  )
}

{
  // This test simulates a real-word editing scenario.
  // Users often write a word, and then switch to a different next position.
  const benchmarkName = '[B1.5] Insert N words at random positions'
  // calculate random input
  let string = ''
  const input = []
  for (let i = 0; i < N; i++) {
    const index = prng.int32(gen, 0, string.length)
    const insert = prng.word(gen, 2, 10)
    string = string.slice(0, index) + insert + string.slice(index)
    input.push({ index, insert })
  }
  benchmarkYjs(
    benchmarkName,
    input,
    (doc, op, i) => { doc.getText('text').insert(op.index, op.insert) },
    (doc1, doc2) => {
      t.assert(doc1.getText('text').toString() === doc2.getText('text').toString())
      t.assert(doc1.getText('text').toString() === string)
    }
  )
  benchmarkOT(
    benchmarkName,
    input,
    (doc, op, i) => { doc.insert(op.index, op.insert) },
    (doc1, doc2) => {
      t.assert(doc1.docContent() === doc2.docContent())
      t.assert(doc1.docContent() === string)
    }
  )
  benchmarkDeltaCrdts(
    benchmarkName,
    input,
    (doc, op, i) => deltaInsertHelper(doc, op.index, op.insert),
    (doc1, doc2) => {
      t.assert(doc1.value().join('') === doc2.value().join(''))
      t.assert(doc1.value().join('') === string)
    }
  )
  benchmarkAutomerge(
    benchmarkName,
    doc => { doc.text = new Automerge.Text() },
    input,
    (doc, op, i) => { doc.text.insertAt(op.index, ...op.insert) },
    (doc1, doc2) => {
      t.assert(doc1.text.join('') === doc2.text.join(''))
      t.assert(doc1.text.join('') === string)
    }
  )
}

{
  const benchmarkName = '[B1.6] Insert string, then delete it'
  const string = prng.word(gen, N, N)
  // B1.1: Insert text from left to right
  benchmarkYjs(
    benchmarkName,
    [string],
    (doc, s, i) => {
      doc.getText('text').insert(i, s)
      doc.getText('text').delete(i, s.length)
    },
    (doc1, doc2) => {
      t.assert(doc1.getText('text').toString() === doc2.getText('text').toString())
      t.assert(doc1.getText('text').toString() === '')
    }
  )
  benchmarkOT(
    benchmarkName,
    [string],
    (doc, s, i) => {
      doc.insert(i, s)
      doc.delete(i, s.length)
    },
    (doc1, doc2) => {
      t.assert(doc1.docContent() === doc2.docContent())
      t.assert(doc1.docContent() === '')
    }
  )
  benchmarkDeltaCrdts(
    benchmarkName,
    [string],
    (doc, s, i) => [...deltaInsertHelper(doc, i, s), ...deltaDeleteHelper(doc, i, s.length)],
    (doc1, doc2) => {
      t.assert(doc1.value().join('') === doc2.value().join(''))
      t.assert(doc1.value().join('') === '')
    }
  )
  benchmarkAutomerge(
    benchmarkName,
    doc => { doc.text = new Automerge.Text() },
    [string],
    (doc, s, i) => {
      doc.text.insertAt(i, ...s)
      doc.text.deleteAt(i, s.length)
    },
    (doc1, doc2) => {
      t.assert(doc1.text.join('') === doc2.text.join(''))
      t.assert(doc1.text.join('') === '')
    }
  )
}

{
  const benchmarkName = '[B1.7] Insert/Delete strings at random positions'
  // calculate random input
  let string = ''
  const input = []
  for (let i = 0; i < N; i++) {
    const index = prng.uint32(gen, 0, string.length)
    if (string.length === index || prng.bool(gen)) {
      const insert = prng.word(gen, 2, 10)
      string = string.slice(0, index) + insert + string.slice(index)
      input.push({ index, insert })
    } else {
      const deleteCount = prng.uint32(gen, 1, math.min(9, string.length - index))
      string = string.slice(0, index) + string.slice(index + deleteCount)
      input.push({ index, deleteCount })
    }
  }
  benchmarkYjs(
    benchmarkName,
    input,
    (doc, op, i) => {
      if (op.insert !== undefined) {
        doc.getText('text').insert(op.index, op.insert)
      } else {
        doc.getText('text').delete(op.index, op.deleteCount)
      }
    },
    (doc1, doc2) => {
      t.assert(doc1.getText('text').toString() === doc2.getText('text').toString())
      t.assert(doc1.getText('text').toString() === string)
    }
  )
  benchmarkOT(
    benchmarkName,
    input,
    (doc, op, i) => {
      if (op.insert !== undefined) {
        doc.insert(op.index, op.insert)
      } else {
        doc.delete(op.index, op.deleteCount)
      }
    },
    (doc1, doc2) => {
      t.assert(doc1.docContent() === doc2.docContent())
      t.assert(doc1.docContent() === string)
    }
  )
  benchmarkDeltaCrdts(
    benchmarkName,
    input,
    (doc, op, i) => {
      if (op.insert !== undefined) {
        return deltaInsertHelper(doc, op.index, op.insert)
      } else {
        return deltaDeleteHelper(doc, op.index, op.deleteCount)
      }
    },
    (doc1, doc2) => {
      t.assert(doc1.value().join('') === doc2.value().join(''))
      t.assert(doc1.value().join('') === string)
    }
  )
  benchmarkAutomerge(
    benchmarkName,
    doc => { doc.text = new Automerge.Text() },
    input,
    (doc, op, i) => {
      if (op.insert !== undefined) {
        doc.text.insertAt(op.index, ...op.insert)
      } else {
        doc.text.deleteAt(op.index, op.deleteCount)
      }
    },
    (doc1, doc2) => {
      t.assert(doc1.text.join('') === doc2.text.join(''))
      t.assert(doc1.text.join('') === string)
    }
  )
}

// benchmarks with numbers begin here

{
  const benchmarkName = '[B1.8] Append N numbers'
  const numbers = Array.from({ length: N }).map(() => prng.uint32(gen, 0, 0x7fffffff))
  benchmarkYjs(
    benchmarkName,
    numbers,
    (doc, s, i) => { doc.getArray('numbers').insert(i, [s]) },
    (doc1, doc2) => {
      t.compare(doc1.getArray('numbers').toArray(), doc2.getArray('numbers').toArray())
      t.compare(doc1.getArray('numbers').toArray(), numbers)
    }
  )
  benchmarkDeltaCrdts(
    benchmarkName,
    numbers,
    (doc, s, i) => deltaInsertHelper(doc, i, [s]),
    (doc1, doc2) => {
      t.compare(doc1.value(), doc2.value())
      t.compare(doc1.value(), numbers)
    }
  )
  benchmarkAutomerge(
    benchmarkName,
    doc => { doc.array = [] },
    numbers,
    (doc, s, i) => { doc.array.insertAt(i, s) },
    (doc1, doc2) => {
      t.compare(Array.from(doc1.array), Array.from(doc2.array))
      t.compare(Array.from(doc1.array), numbers)
    }
  )
}

{
  const benchmarkName = '[B1.9] Insert Array of N numbers'
  const numbers = Array.from({ length: N }).map(() => prng.uint32(gen, 0, 0x7fffffff))
  benchmarkYjs(
    benchmarkName,
    [numbers],
    (doc, s, i) => { doc.getArray('numbers').insert(i, s) },
    (doc1, doc2) => {
      t.compare(doc1.getArray('numbers').toArray(), doc2.getArray('numbers').toArray())
      t.compare(doc1.getArray('numbers').toArray(), numbers)
    }
  )
  benchmarkDeltaCrdts(
    benchmarkName,
    numbers,
    (doc, s, i) => deltaInsertHelper(doc, i, [s]),
    (doc1, doc2) => {
      t.compare(doc1.value().join(''), doc2.value().join(''))
      t.compare(doc1.value(), numbers)
    }
  )
  benchmarkAutomerge(
    benchmarkName,
    doc => { doc.array = [] },
    [numbers],
    (doc, s, i) => { doc.array.insertAt(i, ...s) },
    (doc1, doc2) => {
      t.compare(Array.from(doc1.array), Array.from(doc2.array))
      t.compare(Array.from(doc1.array), numbers)
    }
  )
}

{
  const benchmarkName = '[B1.10] Prepend N numbers'
  const numbers = Array.from({ length: N }).map(() => prng.uint32(gen, 0, 0x7fffffff))
  const numbersReversed = numbers.slice().reverse()

  benchmarkYjs(
    benchmarkName,
    numbers,
    (doc, s, i) => { doc.getArray('numbers').insert(0, [s]) },
    (doc1, doc2) => {
      t.compare(doc1.getArray('numbers').toArray(), doc2.getArray('numbers').toArray())
      t.compare(doc1.getArray('numbers').toArray(), numbersReversed)
    }
  )
  benchmarkDeltaCrdts(
    benchmarkName,
    numbers,
    (doc, s, i) => deltaInsertHelper(doc, 0, [s]),
    (doc1, doc2) => {
      t.compare(doc1.value(), doc2.value())
      t.compare(doc1.value(), numbersReversed)
    }
  )
  benchmarkAutomerge(
    benchmarkName,
    doc => { doc.array = [] },
    numbers,
    (doc, s, i) => { doc.array.insertAt(0, s) },
    (doc1, doc2) => {
      t.compare(Array.from(doc1.array), Array.from(doc2.array))
      t.compare(Array.from(doc1.array), numbersReversed)
    }
  )
}

{
  const benchmarkName = '[B1.11] Insert N numbers at random positions'
  // calculate random input
  const numbers = []
  const input = []
  for (let i = 0; i < N; i++) {
    const index = prng.uint32(gen, 0, numbers.length)
    const insert = prng.uint32(gen, 0, 0x7fffffff)
    numbers.splice(index, 0, insert)
    input.push({ index, insert })
  }

  benchmarkYjs(
    benchmarkName,
    input,
    (doc, op, i) => { doc.getArray('numbers').insert(op.index, [op.insert]) },
    (doc1, doc2) => {
      t.compare(doc1.getArray('numbers').toArray(), doc2.getArray('numbers').toArray())
      t.compare(doc1.getArray('numbers').toArray(), numbers)
    }
  )
  benchmarkDeltaCrdts(
    benchmarkName,
    input,
    (doc, op, i) => deltaInsertHelper(doc, op.index, [op.insert]),
    (doc1, doc2) => {
      t.compare(doc1.value(), doc2.value())
      t.compare(doc1.value(), numbers)
    }
  )
  benchmarkAutomerge(
    benchmarkName,
    doc => { doc.array = [] },
    input,
    (doc, op, i) => { doc.array.insertAt(op.index, op.insert) },
    (doc1, doc2) => {
      t.compare(Array.from(doc1.array), Array.from(doc2.array))
      t.compare(Array.from(doc1.array), numbers)
    }
  )
}
