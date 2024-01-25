import { DiamondFactory } from './factory.js'
import { runBenchmarks, writeBenchmarkResultsToFile } from '../../js-lib/index.js'

;(async () => {
  await runBenchmarks(new DiamondFactory(), testName => testName.startsWith('[B4') || (testName.match(/String|characters|text/) != null && testName.match(/Map|Array/) == null)) // !testName.startsWith('[B4'))
  writeBenchmarkResultsToFile('../results.json', _testName => true)
})()
