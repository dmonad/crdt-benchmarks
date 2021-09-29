import { YjsFactory } from './factory.js'
import { runBenchmarks, writeBenchmarkResultsToFile } from '../../js-lib/index.js'

runBenchmarks(new YjsFactory(), testName => testName.startsWith('[B4x100'))

writeBenchmarkResultsToFile('../results.json')
