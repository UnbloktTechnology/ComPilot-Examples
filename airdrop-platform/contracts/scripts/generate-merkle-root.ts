import { program } from 'commander'
import fs from 'fs'
import { parseBalanceMap } from '@compilot/merkle-tree-js'

program
  .version('0.0.0')
  .requiredOption(
    '-i, --input <path>',
    'input JSON file location containing a map of account addresses to string balances'
  )

program.parse(process.argv)
const opts = program.opts()

const json = JSON.parse(fs.readFileSync(opts.input, { encoding: 'utf8' }))

if (typeof json !== 'object') throw new Error('Invalid JSON')

fs.writeFileSync('outputFiles/merkle.json', JSON.stringify(parseBalanceMap(json)))
