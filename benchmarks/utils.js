
import * as prng from 'lib0/prng.js'
import * as metric from 'lib0/metric.js'
import * as math from 'lib0/math.js'

export const N = 6000
export const disableAutomergeBenchmarks = true
export const disablePeersCrdtsBenchmarks = true
export const disableYjsBenchmarks = false
export const disableOTBenchmarks = false

export const benchmarkResults = {}

export const setBenchmarkResult = (libname, benchmarkid, result) => {
  console.info(libname, benchmarkid, result)
  const libResults = benchmarkResults[benchmarkid] || (benchmarkResults[benchmarkid] = {})
  libResults[libname] = result
}

const perf = typeof performance === 'undefined' ? require('perf_hooks').performance : performance // eslint-disable-line no-undef

export const benchmarkTime = (libname, id, f) => {
  const start = perf.now()
  f()
  const time = perf.now() - start
  setBenchmarkResult(libname, id, `${time.toFixed(0)} ms`)
}

/**
 * A Pseudo Random Number Generator with a constant seed, so that repeating the runs will use the same random values.
 */
export const gen = prng.create(42)

export const cpy = o => JSON.parse(JSON.stringify(o))

export const getMemUsed = () => {
  if (typeof global !== 'undefined' && typeof process !== 'undefined') {
    if (global.gc) {
      global.gc()
    }
    return process.memoryUsage().heapUsed
  }
  return 0
}

export const logMemoryUsed = (libname, id, startHeapUsed) => {
  if (typeof global !== 'undefined' && typeof process !== 'undefined') {
    if (global.gc) {
      global.gc()
    }
    const diff = process.memoryUsage().heapUsed - startHeapUsed
    const p = metric.prefix(diff)
    setBenchmarkResult(libname, `${id} (memUsed)`, `${math.round(math.max(p.n * 10, 0)) / 10} ${p.prefix}B`)
  }
}

export const tryGc = () => {
  if (typeof global !== 'undefined' && typeof process !== 'undefined' && global.gc) {
    global.gc()
  }
}

/**
 * Insert a string into a deltaRga crdt
 *
 * @param {any} doc
 * @param {number} index
 * @param {Array<any>|string} content
 * @return {Array<ArrayBuffer>}
 */
export const deltaInsertHelper = (doc, index, content) => {
  const deltas = []
  for (let i = 0; i < content.length; i++) {
    deltas.push(doc.insertAt(index + i, content[i]))
  }
  return deltas
}

/**
 * Insert a string into a deltaRga crdt
 *
 * @param {any} doc
 * @param {number} index
 * @param {number} length
 * @return {Array<ArrayBuffer>}
 */
export const deltaDeleteHelper = (doc, index, length) => {
  const deltas = []
  for (let i = 0; i < length; i++) {
    deltas.push(doc.removeAt(index))
  }
  return deltas
}
