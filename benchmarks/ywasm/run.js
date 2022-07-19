import { YwasmFactory } from './factory.js'
import { runBenchmarks, writeBenchmarkResultsToFile } from '../../js-lib/index.js'

;(async () => {
  await runBenchmarks(new YwasmFactory(), testName => true) // !testName.startsWith('[B4'))
  writeBenchmarkResultsToFile('../results.json', testName => true)
})()
