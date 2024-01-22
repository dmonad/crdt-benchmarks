#!/usr/bin/env node
/**
 * Render results with conditition N=5000 of yjs and automerge
 * @example
 *   node ./render-table benchmarks/results.json 5000 yjs automerge
 */

import fs from 'fs'

const path = process.argv[2]
const N = process.argv[3]
const benchmarkNames = process.argv.slice(4)
const benchmarkResults = JSON.parse(fs.readFileSync(path, 'utf8'))[N]

// print markdown table with the results
// header
let mdTable = `N = ${N} | ${benchmarkNames.join(' | ')}|\n`
// table-widths
mdTable += `| :- | ${benchmarkNames.map(() => ' -: ').join('|')} |\n`
// Number formatting
const numberFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
const formattableNumber = /^\d+(\.\d+)? [a-zA-Z]+$/
const prettyFormatNumberWithUnits = (numberSpaceUnits) => {
  if (!numberSpaceUnits) return 'skipped'
  if (!formattableNumber.test(numberSpaceUnits)) return numberSpaceUnits
  const [number, units] = numberSpaceUnits.split(' ')
  const parsedNumber = parseFloat(number)
  return `${numberFormat.format(parsedNumber)} ${units}`
}

for (const id in benchmarkResults) {
  mdTable += `|${id.padEnd(73, ' ')} | ${benchmarkNames.map(name => (prettyFormatNumberWithUnits(benchmarkResults[id][name])).padStart(16, ' ')).join(' | ')} |\n`
}
console.log(mdTable)
