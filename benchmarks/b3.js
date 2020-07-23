
import * as Y from 'yjs'
import { setBenchmarkResult, benchmarkTime, N, disableAutomergeBenchmarks, logMemoryUsed, getMemUsed, computeAutomergeUpdateSize } from './utils.js'
import * as t from 'lib0/testing.js'
import * as math from 'lib0/math.js'
// @ts-ignore
import Automerge from 'automerge'

const sqrtN = math.floor(Math.sqrt(N))

const benchmarkYjs = (id, changeDoc, check) => {
  const startHeapUsed = getMemUsed()
  const docs = []
  const updates = []
  for (let i = 0; i < sqrtN; i++) {
    const doc = new Y.Doc()
    doc.on('updateV2', (update, origin) => {
      if (origin !== 'remote') {
        updates.push(update)
      }
    })
    docs.push(doc)
  }
  for (let i = 0; i < docs.length; i++) {
    changeDoc(docs[i], i)
  }
  // sync client 0 for reference
  for (let i = 0; i < updates.length; i++) {
    Y.applyUpdateV2(docs[0], updates[i], 'remote')
  }
  benchmarkTime('yjs', `${id} (time)`, () => {
    for (let i = 0; i < updates.length; i++) {
      Y.applyUpdateV2(docs[1], updates[i], 'remote')
    }
  })
  t.assert(updates.length === sqrtN)
  check(docs.slice(0, 2))
  setBenchmarkResult('yjs', `${id} (updateSize)`, `${updates.reduce((len, update) => len + update.byteLength, 0)} bytes`)
  /**
   * @type {any}
   */
  let encodedState
  benchmarkTime('yjs', `${id} (encodeTime)`, () => {
    encodedState = Y.encodeStateAsUpdateV2(docs[0])
  })
  const documentSize = encodedState.byteLength
  setBenchmarkResult('yjs', `${id} (docSize)`, `${documentSize} bytes`)
  benchmarkTime('yjs', `${id} (parseTime)`, () => {
    const doc = new Y.Doc()
    Y.applyUpdateV2(doc, encodedState)
  })
  logMemoryUsed('yjs', id, startHeapUsed)
}

const benchmarkAutomerge = (id, init, changeDoc, check) => {
  const startHeapUsed = getMemUsed()
  if (N > 10000 || disableAutomergeBenchmarks) {
    setBenchmarkResult('automerge', id, 'skipping')
    return
  }
  const docs = []
  for (let i = 0; i < sqrtN; i++) {
    docs.push(Automerge.init())
  }
  docs[0] = Automerge.change(docs[0], init)
  const initUpdate = Automerge.getAllChanges(docs[0])
  for (let i = 1; i < docs.length; i++) {
    docs[i] = Automerge.applyChanges(docs[i], initUpdate)
  }
  const updates = []
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i]
    const updatedDoc = Automerge.change(doc, d => { changeDoc(d, i) })
    const update = Automerge.getChanges(doc, updatedDoc)
    updates.push(update)
    docs[i] = updatedDoc
  }
  for (let i = 0; i < updates.length; i++) {
    docs[0] = Automerge.applyChanges(docs[0], updates[i])
  }
  benchmarkTime('automerge', `${id} (time)`, () => {
    for (let i = 0; i < updates.length; i++) {
      docs[1] = Automerge.applyChanges(docs[1], updates[i])
    }
  })
  check(docs.slice(0, 2))
  setBenchmarkResult('automerge', `${id} (updateSize)`, `${updates.reduce((len, update) => len + computeAutomergeUpdateSize(update), 0)} bytes`)
  /**
   * @type {any}
   */
  let encodedState
  benchmarkTime('automerge', `${id} (encodeTime)`, () => {
    encodedState = Automerge.save(docs[0])
  })
  const documentSize = encodedState.byteLength
  setBenchmarkResult('automerge', `${id} (docSize)`, `${documentSize} bytes`)
  benchmarkTime('automerge', `${id} (parseTime)`, () => {
    Automerge.load(encodedState)
  })
  logMemoryUsed('automerge', id, startHeapUsed)
}

{
  const benchmarkName = '[B3.1] √N clients concurrently set number in Map'
  benchmarkYjs(
    benchmarkName,
    (doc, i) => doc.getMap('map').set('v', i),
    docs => {
      const v = docs[0].getMap('map').get('v')
      docs.forEach(doc => {
        t.assert(doc.getMap('map').get('v') === v)
      })
    }
  )
  benchmarkAutomerge(
    benchmarkName,
    doc => {},
    (doc, i) => { doc.v = i },
    docs => {
      const v = docs[0].v
      docs.forEach(doc => {
        t.assert(doc.v === v)
      })
    }
  )
}

{
  const benchmarkName = '[B3.2] √N clients concurrently set Object in Map'
  // each client sets a user data object { name: id, address: 'here' }
  benchmarkYjs(
    benchmarkName,
    (doc, i) => {
      const v = new Y.Map()
      v.set('name', i.toString())
      v.set('address', 'here')
      doc.getMap('map').set('v', v)
    },
    docs => {
      const v = docs[0].getMap('map').get('v').get('name')
      docs.forEach(doc => {
        t.assert(doc.getMap('map').get('v').get('name') === v)
      })
    }
  )
  benchmarkAutomerge(
    benchmarkName,
    doc => {},
    (doc, i) => { doc.v = { name: i.toString(), address: 'here' } },
    docs => {
      const v = docs[0].v.name
      docs.forEach(doc => {
        t.assert(doc.v.name === v)
      })
    }
  )
}

{
  const benchmarkName = '[B3.3] √N clients concurrently set String in Map'
  benchmarkYjs(
    benchmarkName,
    (doc, i) => {
      doc.getMap('map').set('v', i.toString().repeat(sqrtN))
    },
    docs => {
      const v = docs[0].getMap('map').get('v')
      docs.forEach(doc => {
        t.assert(doc.getMap('map').get('v') === v)
      })
    }
  )
  benchmarkAutomerge(
    benchmarkName,
    doc => {},
    (doc, i) => { doc.v = i.toString().repeat(sqrtN) },
    docs => {
      const v = docs[0].v
      docs.forEach(doc => {
        t.assert(doc.v === v)
      })
    }
  )
}

{
  const benchmarkName = '[B3.4] √N clients concurrently insert text in Array'
  benchmarkYjs(
    benchmarkName,
    (doc, i) => {
      doc.getArray('array').insert(0, [i.toString()])
    },
    docs => {
      const len = docs[0].getArray('array').length
      docs.forEach(doc => {
        t.assert(doc.getArray('array').length === len)
      })
    }
  )
  benchmarkAutomerge(
    benchmarkName,
    doc => { doc.array = [] },
    (doc, i) => { doc.array.insertAt(0, i.toString()) },
    docs => {
      const len = docs[0].array.length
      docs.forEach(doc => {
        t.assert(doc.array.length === len)
      })
    }
  )
}
