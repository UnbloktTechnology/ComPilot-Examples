import * as fs from 'fs'

import 'dotenv/config'
import '@nomiclabs/hardhat-ethers'
import { ethers } from 'hardhat'
import { Address } from 'viem'
import { Contract } from 'ethers'

interface MerkleData {
  merkleRoot: string
}

interface AllowListData {
  balances: { address: string; earnings: string; reasons: string }[]
}

export const getLocalMerkleRoot = () => {
  // Read the JSON file
  const data = fs.readFileSync('./outputFiles/merkle.json', 'utf-8')

  // Parse the JSON data
  const jsonData: MerkleData = JSON.parse(data)

  // Extract the merkleRoot and assign it to the constant root
  const root = jsonData.merkleRoot

  // Log the result (or use it in your application)
  console.log('Merkle Root:', root)
  return root
}

const getTotalDistributionAmount = (): bigint => {
  const data = fs.readFileSync('./outputFiles/allowListObj.json', 'utf-8')
  const jsonData: AllowListData = JSON.parse(data)
  return jsonData.balances.reduce((total, balance) => total + BigInt(balance.earnings), BigInt(0))
}

const deployDistributorManually = async (
  token: Contract,
  merkleRoot: string,
  txSignerAddress: Address,
  distributorInitBalance: bigint
) => {
  console.log('inputs for merkleDistributor: ', token.address, merkleRoot, txSignerAddress)
  const MerkleDistributor = await ethers.getContractFactory('MerkleDistributor')
  const merkleDistributor = await MerkleDistributor.deploy()
  await merkleDistributor.deployed()
  console.log(`merkleDistributor deployed at ${merkleDistributor.address}`)
  // Initialize Merkle Distributor
  const initTrx = await merkleDistributor.initialize(token.address, merkleRoot, txSignerAddress)
  await initTrx.wait()
  console.log('Merkle Distributor initialized')

  // set Balance for distributor to a million
  await token.setBalance(merkleDistributor.address, distributorInitBalance)
  console.log(`Set Distributor balance to ${distributorInitBalance}`)

  return merkleDistributor
}

const deployDistributorWithFactory = async (
  factoryAddress: Address,
  token: Contract,
  merkleRoot: string,
  txSignerAddress: Address,
  distributorInitBalance: bigint
) => {
  console.log(`Deploying MerkleDistributor using MerkleDistributorFactory at ${factoryAddress}`)
  const merkleDistributorFactory = await ethers.getContractAt('MerkleDistributorFactory', factoryAddress)
  console.log(`Using MerkleDistributorFactory at ${merkleDistributorFactory.address}`)

  // use a single deploy account
  const signers = await ethers.getSigners()
  const deployer = signers[0]

  // mint the required amount to the signer address
  console.log(`Minting ${distributorInitBalance} to deployer`)
  await token.connect(deployer).setBalance(deployer.address, distributorInitBalance)
  console.log(`Set deployer balance to ${distributorInitBalance}`)

  // approve distributor to spend the required amount
  console.log(`Approving ${distributorInitBalance} to MerkleDistributorFactory`)
  let tx = await token.connect(deployer).approve(merkleDistributorFactory.address, distributorInitBalance)
  await tx.wait()
  console.log(`Approved MerkleDistributorFactory to spend ${distributorInitBalance}`)

  // confirm allowance
  const allowance = await token.allowance(deployer.address, merkleDistributorFactory.address)
  console.log(`Allowance: ${allowance}`)

  // Deploy Merkle Distributor
  console.log('inputs for merkleDistributor: ', token.address, merkleRoot, txSignerAddress)
  tx = await merkleDistributorFactory
    .connect(deployer)
    .createDistributor(token.address, merkleRoot, distributorInitBalance, txSignerAddress)
  let receipt = await tx.wait()
  console.log(`Merkle Distributor created with tx: ${receipt.transactionHash}`)
  const event = receipt.events?.find((e: any) => e.event === 'MerkleDistributorCreated')
  const merkleDistributorAddress = event?.args.proxy as Address
  console.log(`Merkle Distributor created at ${merkleDistributorAddress}`)
  const merkleDistributor = await ethers.getContractAt('MerkleDistributor', merkleDistributorAddress)
  console.log(`merkleDistributor deployed at ${merkleDistributor.address}`)

  return merkleDistributor
}

async function main({ useFactory }: { useFactory: null | Address }) {
  // Deploy example token
  const tokenFactory = await ethers.getContractFactory('TestERC20')
  const token = await tokenFactory.deploy('AidropToken', 'ATKN', 0)
  console.log(`Example token deployed at ${token.address}`)

  const merkleRoot =
    process.env.DEPLOY_ROOT === 'local' || process.env.DEPLOY_ROOT === undefined
      ? getLocalMerkleRoot()
      : process.env.DEPLOY_ROOT
  const txSignerAddress = process.env.TX_SIGNER_ADDRESS as Address
  const distributorInitBalance = process.env.DISTRIBUTOR_INIT_BALANCE
    ? BigInt(process.env.DISTRIBUTOR_INIT_BALANCE)
    : getTotalDistributionAmount()

  // Deploy Merkle Distributor
  const merkleDistributor = useFactory
    ? await deployDistributorWithFactory(useFactory, token, merkleRoot, txSignerAddress, distributorInitBalance)
    : await deployDistributorManually(token, merkleRoot, txSignerAddress, distributorInitBalance)

  // Save deployed addresses in the outputFiles
  fs.writeFileSync(
    `outputFiles/deployment-${new Date().toISOString()}.json`,
    JSON.stringify({ tokenAddress: token.address, merkleDistributorAddress: merkleDistributor.address })
  )
}

const factoryAddress = process.env.FACTORY_ADDRESS ? (process.env.FACTORY_ADDRESS as Address) : null
main({ useFactory: factoryAddress ? factoryAddress : null })
  // eslint-disable-next-line no-process-exit
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    // eslint-disable-next-line no-process-exit
    process.exit(1)
  })
