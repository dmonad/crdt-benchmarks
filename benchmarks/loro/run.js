import { LoroFactory } from './factory.js'
import { runBenchmarks, writeBenchmarkResultsToFile } from '../../js-lib/index.js'

; (async () => {
  await runBenchmarks(new LoroFactory(), testName => true)
  writeBenchmarkResultsToFile('../results.json', testName => true)
})()
