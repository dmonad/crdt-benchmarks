import * as Y from 'yjs'
import { setBenchmarkResult, N, benchmarkTime, disableAutomergeBenchmarks, logMemoryUsed, getMemUsed, tryGc } from './utils.js'
import * as math from 'lib0/math.js'
import * as t from 'lib0/testing.js'
import Automerge from 'automerge'
// @ts-ignore
import { edits, finalText } from './b4-editing-trace.js'

const benchmarkYjs = (id, inputData, changeFunction, check) => {
  let encodedState = /** @type {any} */ (null)
  ;(() => {
    // We scope the creation of doc1 so we can gc it before we parse it again.
    const doc1 = new Y.Doc()
    let updateSize = 0
    doc1.on('update', update => {
      updateSize += update.byteLength
    })
    benchmarkTime('yjs', `${id} (time)`, () => {
      for (let i = 0; i < inputData.length; i++) {
        changeFunction(doc1, inputData[i], i)
      }
    })
    check(doc1)
    setBenchmarkResult('yjs', `${id} (updateSize)`, `${math.round(updateSize)} bytes`)
    /**
     * @type {any}
     */
    benchmarkTime('yjs', `${id} (encodeTime)`, () => {
      encodedState = Y.encodeStateAsUpdate(doc1)
    })
  })()
  const documentSize = encodedState.byteLength
  setBenchmarkResult('yjs', `${id} (docSize)`, `${documentSize} bytes`)
  tryGc()
  ;(() => {
    const startHeapUsed = getMemUsed()
    // @ts-ignore we only store doc so it is not garbage collected
    let doc = null // eslint-disable-line
    benchmarkTime('yjs', `${id} (parseTime)`, () => {
      doc = new Y.Doc()
      Y.applyUpdate(doc, encodedState)
    })
    logMemoryUsed('yjs', id, startHeapUsed)
  })()
}

const benchmarkAutomerge = (id, init, inputData, changeFunction, check) => {
  /**
   * @type {any}
   */
  let encodedState
  if (N > 10000 || disableAutomergeBenchmarks) {
    setBenchmarkResult('automerge', id, 'skipping')
    return
  }
  ;(() => {
    // We scope the creation of the first doc so we can gc it before we continue parting it.
    // Note: Automerge 0.10.1 uses so much memory that there is only enough memory for a single doc
    // containing all the edits from b4.
    const emptyDoc = Automerge.init()
    let doc1 = Automerge.change(emptyDoc, init)
    let updateSize = 0
    benchmarkTime('automerge', `${id} (time)`, () => {
      for (let i = 0; i < inputData.length; i++) {
        const updatedDoc = Automerge.change(doc1, doc => {
          changeFunction(doc, inputData[i], i)
        })
        const update = JSON.stringify(Automerge.getChanges(doc1, updatedDoc))
        updateSize += update.length
        doc1 = updatedDoc
      }
    })
    check(doc1)
    setBenchmarkResult('automerge', `${id} (updateSize)`, `${math.round(updateSize)} bytes`)
    benchmarkTime('automerge', `${id} (encodeTime)`, () => {
      encodedState = Automerge.save(doc1)
    })
    const documentSize = encodedState.length
    setBenchmarkResult('automerge', `${id} (docSize)`, `${documentSize} bytes`)
  })()
  ;(() => {
    const startHeapUsed = getMemUsed()
    // @ts-ignore We only keep doc so the document is not garbage collected
    let doc = null // eslint-disable-line
    benchmarkTime('automerge', `${id} (parseTime)`, () => {
      doc = Automerge.load(encodedState)
    })
    logMemoryUsed('automerge', id, startHeapUsed)
  })()
}

{
  const benchmarkName = '[B4] Apply real-world editing dataset'
  benchmarkYjs(
    benchmarkName,
    edits,
    (doc, edit) => {
      const ytext = doc.getText('text')
      ytext.delete(edit[0], edit[1])
      if (edit[2]) {
        ytext.insert(edit[0], edit[2])
      }
    },
    doc1 => {
      t.assert(doc1.getText('text').toString() === finalText)
    }
  )
  benchmarkAutomerge(
    benchmarkName,
    doc => { doc.text = new Automerge.Text() },
    edits,
    (doc, edit) => {
      if (edit[1] > 0) {
        doc.text.deleteAt(edit[0], edit[1])
      }
      if (edit[2]) {
        doc.text.insertAt(edit[0], edit[2])
      }
    },
    doc1 => {
      t.assert(doc1.text.join('') === finalText)
    }
  )
}
