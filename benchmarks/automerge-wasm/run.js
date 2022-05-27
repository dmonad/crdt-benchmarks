import { AutomergeFactory } from './factory.js'
import { runBenchmarks, writeBenchmarkResultsToFile } from '../../js-lib/index.js'

const logMemOnly = process.argv[2] === 'mem-only'

;(async () => {
  await runBenchmarks(new AutomergeFactory(), testName => testName.startsWith('[B4x100'))
  writeBenchmarkResultsToFile('../results.json', testId => logMemOnly && testId.search('(memUsed)') < 0)
})()
