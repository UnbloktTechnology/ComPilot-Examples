import * as fs from 'fs'

import 'dotenv/config'
import '@nomiclabs/hardhat-ethers'
import { ethers } from 'hardhat'

async function main() {
  // Deploy Merkle Distributor factory
  const MerkleDistributorFactory = await ethers.getContractFactory('MerkleDistributorFactory')
  const factoryContract = await MerkleDistributorFactory.deploy()
  await factoryContract.deployed()
  console.log(`factory contract deployed at ${factoryContract.address}`)

  // Save deployed addresses in the outputFiles
  fs.writeFileSync(
    `outputFiles/factory-deployment-${new Date().toISOString()}.json`,
    JSON.stringify({ factoryContract: factoryContract.address })
  )
}

main()
  // eslint-disable-next-line no-process-exit
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    // eslint-disable-next-line no-process-exit
    process.exit(1)
  })
