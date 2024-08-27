import { ListPositionsFactory } from './factory.js'
import { runBenchmarks, writeBenchmarkResultsToFile } from '../../js-lib/index.js'

;(async () => {
  await runBenchmarks(new ListPositionsFactory(), testName => (testName.match(/Map/) == null)) // !testName.startsWith('[B4x'))
  writeBenchmarkResultsToFile('../results.json', testName => true)
})()
