import { runBenchmarksB1 } from '../js-lib/b1.js'
import { runBenchmarkB2 } from '../js-lib/b2.js'
import { runBenchmarkB3 } from '../js-lib/b3.js'
import { runBenchmarkB4 } from '../js-lib/b4.js'
import { CrdtFactory, writeBenchmarkResultsToFile } from './utils.js' // eslint-disable-line

export * from './b1.js'
export * from './b2.js'
export * from './b3.js'
export * from './b4.js'
export * from './b4-editing-trace.js'
export * from './utils.js'

/**
 * @param {CrdtFactory} crdtFactory
 * @param {function(string):boolean} filter
 */
export const runBenchmarks = async (crdtFactory, filter) => {
  await runBenchmarksB1(crdtFactory, filter)
  await runBenchmarkB2(crdtFactory, filter)
  await runBenchmarkB3(crdtFactory, filter)
  await runBenchmarkB4(crdtFactory, filter)
  writeBenchmarkResultsToFile('../results.json')
}
