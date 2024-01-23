import { LoroFactory } from './factory.js'
import { runBenchmarks, writeBenchmarkResultsToFile } from '../../js-lib/index.js'

;(async () => {
  await runBenchmarks(new LoroFactory(), testName => !testName.startsWith('[B4x100'))
  writeBenchmarkResultsToFile('../results.json', testName => true)
})()
