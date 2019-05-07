
import * as prng from 'lib0/prng.js'

export const benchmarkResults = {}

export const setBenchmarkResult = (libname, benchmarkid, result) => {
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

export const gen = prng.create(42)

export const N = 150

export const cpy = o => JSON.parse(JSON.stringify(o))
