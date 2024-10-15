import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { signTxAuthDataLibEthers } from '@nexeraprotocol/nexera-id-sig-gating-contracts-sdk/lib'
import chai, { expect } from 'chai'
import { createBalanceTree, BalanceTree, parseBalanceMap, verifyProof } from '@compilot/merkle-tree-js'
import { solidity } from 'ethereum-waffle'
import { BigNumber, Contract } from 'ethers'
import type { Wallet } from 'ethers'
import { ethers } from 'hardhat'
import { type Address } from 'viem'

import merkleDistributorArtifact from '../artifacts/contracts/MerkleDistributor.sol/MerkleDistributor.json'
import merkleDistributorWithDeadlineArtifact from '../artifacts/contracts/MerkleDistributorWithDeadline.sol/MerkleDistributorWithDeadline.json'

chai.use(solidity)

const overrides = {
  gasLimit: 9999999,
}
const maxGas = {
  MerkleDistributor: {
    twoAccountTree: 140000,
    largerTreeFirstClaim: 140000,
    largerTreeSecondClaim: 140000,
    realisticTreeGas: 150000,
    realisticTreeGasDeeperNode: 150000,
    realisticTreeGasAverageRandom: 150000,
    realisticTreeGasAverageFirst25: 150000,
  },
  MerkleDistributorWithDeadline: {
    twoAccountTree: 140000,
    largerTreeFirstClaim: 140000,
    largerTreeSecondClaim: 140000,
    realisticTreeGas: 150000,
    realisticTreeGasDeeperNode: 150000,
    realisticTreeGasAverageRandom: 150000,
    realisticTreeGasAverageFirst25: 150000,
  },
}

const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000'

const deployContract = async (
  creatorWallet: SignerWithAddress,
  distributorFactoryContract: Contract,
  tokenContract: Contract,
  merkleRoot: string,
  contractName: string,
  signerAddress: string,
  totalBalance: bigint,
  endTime: number = Math.floor(Date.now() / 1000) + 31536000
) => {
  await tokenContract.setBalance(creatorWallet.address, totalBalance)

  // allow the distributor to transfer the tokens
  await tokenContract.connect(creatorWallet).approve(distributorFactoryContract.address, totalBalance)

  let deployTransaction

  if (contractName === 'MerkleDistributorWithDeadline') {
    deployTransaction = await distributorFactoryContract
      .connect(creatorWallet)
      .createDistributorWithDeadline(tokenContract.address, merkleRoot, endTime, totalBalance, signerAddress, overrides)
  } else {
    deployTransaction = await distributorFactoryContract
      .connect(creatorWallet)
      .createDistributor(tokenContract.address, merkleRoot, totalBalance, signerAddress, overrides)
  }

  const deployReceipt = await deployTransaction.wait()
  const event = deployReceipt.events?.find((e: any) => e.event === 'MerkleDistributorCreated')
  const distributorAddress = event?.args.proxy
  const distributor = await ethers.getContractAt(
    contractName == 'MerkleDistributorWithDeadline'
      ? merkleDistributorWithDeadlineArtifact.abi
      : merkleDistributorArtifact.abi,
    distributorAddress
  )

  expect(await distributor.token()).to.eq(tokenContract.address)
  expect(await distributor.merkleRoot()).to.eq(merkleRoot)
  expect(await tokenContract.allowance(creatorWallet.address, distributorAddress)).to.eq(0n)
  expect(await tokenContract.balanceOf(distributorAddress)).to.eq(totalBalance)

  if (contractName === 'MerkleDistributorWithDeadline') {
    expect(await distributor.owner()).to.eq(creatorWallet.address)
    expect(await distributor.endTime()).to.eq(endTime)
  }
  return distributor
}

type ClaimArgs = {
  index: number
  amount: number
  merkleProof: string[]
}

const buildClaimTxData = async (
  distributorContract: Contract,
  contractName: string,
  senderSignerAddress: string,
  txAuthSigner: SignerWithAddress,
  claimArgs: ClaimArgs
) => {
  const txAuthInput = {
    contractAbi: Array.from(
      contractName == 'MerkleDistributorWithDeadline'
        ? merkleDistributorWithDeadlineArtifact.abi
        : merkleDistributorArtifact.abi
    ),
    contractAddress: distributorContract.address as Address,
    functionName: 'claim',
    args: [claimArgs.index, claimArgs.amount, claimArgs.merkleProof],
    userAddress: senderSignerAddress as Address,
  }

  const signatureResponse = await signTxAuthDataLibEthers(txAuthSigner as unknown as Wallet, txAuthInput)

  // Encoding the blockExpiration (uint256) and signature (bytes)
  const abiEncodedBlockExpiration = ethers.utils.hexZeroPad(
    ethers.BigNumber.from(signatureResponse.blockExpiration).toHexString(),
    32
  )

  const unsignedTx = await distributorContract.populateTransaction.claim(
    claimArgs.index,
    claimArgs.amount,
    claimArgs.merkleProof
  )

  // Complete data
  const txData = unsignedTx.data + abiEncodedBlockExpiration.slice(2) + signatureResponse.signature.slice(2)

  return txData
}

const claimWithSignature = async (
  distributorContract: Contract,
  contractName: string,
  senderSigner: SignerWithAddress,
  txAuthSigner: SignerWithAddress,
  claimArgs: ClaimArgs
) => {
  const txData = await buildClaimTxData(
    distributorContract,
    contractName,
    senderSigner.address,
    txAuthSigner,
    claimArgs
  )
  // Send tx
  return await senderSigner.sendTransaction({
    to: distributorContract.address,
    data: txData,
    gasLimit: 9999999,
  })
}

for (const contract of ['MerkleDistributor', 'MerkleDistributorWithDeadline'] as const) {
  describe(`${contract} tests`, () => {
    let mockToken: Contract
    let distributorFactory: Contract
    let creatorWallet: SignerWithAddress
    let wallet0: SignerWithAddress
    let wallet1: SignerWithAddress
    let txSigner: SignerWithAddress
    let wallets: SignerWithAddress[]

    beforeEach(async () => {
      wallets = await ethers.getSigners()
      wallet0 = wallets[0]
      wallet1 = wallets[1]
      txSigner = wallets[2]
      creatorWallet = wallets[3]
      const tokenFactory = await ethers.getContractFactory('TestERC20', wallet0)
      mockToken = await tokenFactory.deploy('Token', 'TKN', 0, overrides)

      const factoryFactory = await ethers.getContractFactory('MerkleDistributorFactory', wallet0)
      distributorFactory = await factoryFactory.deploy()
    })

    describe('#token', () => {
      it('returns the token address', async () => {
        const distributor = await deployContract(
          creatorWallet,
          distributorFactory,
          mockToken,
          ZERO_BYTES32,
          contract,
          txSigner.address,
          0n
        )
        expect(await distributor.token()).to.eq(mockToken.address)
      })
    })

    describe('#merkleRoot', () => {
      it('returns the zero merkle root', async () => {
        const distributor = await deployContract(
          creatorWallet,
          distributorFactory,
          mockToken,
          ZERO_BYTES32,
          contract,
          txSigner.address,
          0n
        )
        expect(await distributor.merkleRoot()).to.eq(ZERO_BYTES32)
      })
    })

    describe('#claim', () => {
      it('fails for empty proof', async () => {
        const distributor = await deployContract(
          creatorWallet,
          distributorFactory,
          mockToken,
          ZERO_BYTES32,
          contract,
          txSigner.address,
          0n
        )
        await expect(
          claimWithSignature(distributor, contract, wallet0, txSigner, {
            index: 0,
            amount: 10,
            merkleProof: [],
          })
        ).to.be.revertedWith('InvalidProof')
      })

      it('fails for invalid index', async () => {
        const distributor = await deployContract(
          creatorWallet,
          distributorFactory,
          mockToken,
          ZERO_BYTES32,
          contract,
          txSigner.address,
          0n
        )
        await expect(
          claimWithSignature(distributor, contract, wallet0, txSigner, {
            index: 0,
            amount: 10,
            merkleProof: [],
          })
        ).to.be.revertedWith('InvalidProof')
      })

      describe('eligible contract (multisig or account abstraction support)', async () => {
        let distributor: Contract
        let tree: BalanceTree
        let mockClaimerContract: Contract
        beforeEach('deploy', async () => {
          const claimerContractFactory = await ethers.getContractFactory('TestClaimerContract', wallet0)
          mockClaimerContract = await claimerContractFactory.deploy()

          tree = createBalanceTree({
            balances: [{ account: mockClaimerContract.address as Address, amount: BigInt(100) }],
          })
          const totalAmount = BigInt(100)
          await mockToken.setBalance(txSigner.address, totalAmount)
          distributor = await deployContract(
            creatorWallet,
            distributorFactory,
            mockToken,
            tree.getHexRoot(),
            contract,
            txSigner.address,
            totalAmount
          )
          expect(await mockToken.balanceOf(distributor.address)).to.eq(totalAmount)
        })

        it('successful contract claim', async () => {
          const claimerTxCallData = await buildClaimTxData(
            distributor,
            contract,
            mockClaimerContract.address,
            txSigner,
            {
              index: 0,
              amount: 100,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: mockClaimerContract.address as Address,
                amount: BigInt(100),
              }),
            }
          )

          expect(await mockToken.balanceOf(mockClaimerContract.address)).to.eq(0)
          const trx = mockClaimerContract.claim(distributor.address, claimerTxCallData)
          await expect(trx).not.to.be.reverted
          await expect(trx).to.emit(distributor, 'Claimed').withArgs(0, mockClaimerContract.address, 100)
          expect(await mockToken.balanceOf(mockClaimerContract.address)).to.eq(100)
        })
      })

      describe('two account tree', () => {
        let distributor: Contract
        let tree: BalanceTree
        beforeEach('deploy', async () => {
          tree = createBalanceTree({
            balances: [
              { account: wallet0.address as Address, amount: BigInt(100) },
              { account: wallet1.address as Address, amount: BigInt(101) },
            ],
          })
          const totalAmount = BigInt(201)
          await mockToken.setBalance(txSigner.address, totalAmount)
          distributor = await deployContract(
            creatorWallet,
            distributorFactory,
            mockToken,
            tree.getHexRoot(),
            contract,
            txSigner.address,
            totalAmount
          )
          expect(await mockToken.balanceOf(distributor.address)).to.eq(totalAmount)
        })

        it('successful claim', async () => {
          await expect(
            claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: 0,
              amount: 100,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallet0.address as Address,
                amount: BigInt(100),
              }),
            })
          )
            .to.emit(distributor, 'Claimed')
            .withArgs(0, wallet0.address, 100)

          await expect(
            claimWithSignature(distributor, contract, wallet1, txSigner, {
              index: 1,
              amount: 101,
              merkleProof: tree.getProof({
                index: BigInt(1),
                account: wallet1.address as Address,
                amount: BigInt(101),
              }),
            })
          )
            .to.emit(distributor, 'Claimed')
            .withArgs(1, wallet1.address, 101)
        })

        it('transfers the token', async () => {
          expect(await mockToken.balanceOf(wallet0.address)).to.eq(0)
          await claimWithSignature(distributor, contract, wallet0, txSigner, {
            index: 0,
            amount: 100,
            merkleProof: tree.getProof({ index: BigInt(0), account: wallet0.address as Address, amount: BigInt(100) }),
          })
          expect(await mockToken.balanceOf(wallet0.address)).to.eq(100)
        })

        it('must have enough to transfer', async () => {
          await mockToken.setBalance(distributor.address, 99)
          await expect(
            claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: 0,
              amount: 100,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallet0.address as Address,
                amount: BigInt(100),
              }),
            })
          ).to.be.revertedWith('ERC20: transfer amount exceeds balance')
        })

        it('sets #isClaimed', async () => {
          expect(await distributor.isClaimed(0)).to.eq(false)
          expect(await distributor.isClaimed(1)).to.eq(false)
          await claimWithSignature(distributor, contract, wallet0, txSigner, {
            index: 0,
            amount: 100,
            merkleProof: tree.getProof({ index: BigInt(0), account: wallet0.address as Address, amount: BigInt(100) }),
          })
          expect(await distributor.isClaimed(0)).to.eq(true)
          expect(await distributor.isClaimed(1)).to.eq(false)
        })

        it('cannot allow two claims', async () => {
          await expect(
            claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: 0,
              amount: 100,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallet0.address as Address,
                amount: BigInt(100),
              }),
            })
          ).not.to.be.reverted
          await expect(
            claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: 0,
              amount: 100,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallet0.address as Address,
                amount: BigInt(100),
              }),
            })
          ).to.be.revertedWith('AlreadyClaimed()')
        })

        it('cannot claim more than once: 0 and then 1', async () => {
          await expect(
            claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: 0,
              amount: 100,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallet0.address as Address,
                amount: BigInt(100),
              }),
            })
          ).not.to.be.reverted

          await expect(
            claimWithSignature(distributor, contract, wallet1, txSigner, {
              index: 1,
              amount: 101,
              merkleProof: tree.getProof({
                index: BigInt(1),
                account: wallet1.address as Address,
                amount: BigInt(101),
              }),
            })
          ).not.to.be.reverted

          await expect(
            claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: 0,
              amount: 100,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallet0.address as Address,
                amount: BigInt(100),
              }),
            })
          ).to.be.revertedWith('AlreadyClaimed()')
        })

        it('cannot claim more than once: 1 and then 0', async () => {
          await expect(
            claimWithSignature(distributor, contract, wallet1, txSigner, {
              index: 1,
              amount: 101,
              merkleProof: tree.getProof({
                index: BigInt(1),
                account: wallet1.address as Address,
                amount: BigInt(101),
              }),
            })
          ).not.to.be.reverted
          await expect(
            claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: 0,
              amount: 100,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallet0.address as Address,
                amount: BigInt(100),
              }),
            })
          ).not.to.be.reverted

          await expect(
            claimWithSignature(distributor, contract, wallet1, txSigner, {
              index: 1,
              amount: 101,
              merkleProof: tree.getProof({
                index: BigInt(1),
                account: wallet1.address as Address,
                amount: BigInt(101),
              }),
            })
          ).to.be.revertedWith('AlreadyClaimed()')
        })

        it('cannot claim for address other than proof', async () => {
          await expect(
            claimWithSignature(distributor, contract, wallet1, txSigner, {
              index: 1,
              amount: 101,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallet0.address as Address,
                amount: BigInt(100),
              }),
            })
          ).to.be.revertedWith('InvalidProof')
        })

        it('cannot claim more than proof', async () => {
          await expect(
            claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: 0,
              amount: 101,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallet0.address as Address,
                amount: BigInt(100),
              }),
            })
          ).to.be.revertedWith('InvalidProof')
        })

        it('gas', async () => {
          const proof = tree.getProof({ index: BigInt(0), account: wallet0.address as Address, amount: BigInt(100) })
          const tx = await claimWithSignature(distributor, contract, wallet0, txSigner, {
            index: 0,
            amount: 100,
            merkleProof: proof,
          })
          const receipt = await tx.wait()
          expect(receipt.gasUsed).to.be.lte(maxGas[contract].twoAccountTree)
        })
      })

      describe('larger tree', () => {
        let distributor: Contract
        let tree: ReturnType<typeof createBalanceTree>
        beforeEach('deploy', async () => {
          tree = createBalanceTree({
            balances: wallets.map((wallet, ix) => {
              return { account: wallet.address as Address, amount: BigInt(ix + 1) }
            }),
          })
          const totalAmount = wallets.reduce((acc, wallet) => acc + BigInt(wallet.address), BigInt(0))
          await mockToken.setBalance(txSigner.address, totalAmount)
          distributor = await deployContract(
            creatorWallet,
            distributorFactory,
            mockToken,
            tree.getHexRoot(),
            contract,
            txSigner.address,
            totalAmount
          )
          expect(await mockToken.balanceOf(distributor.address)).to.eq(totalAmount)
        })

        it('claim index 4', async () => {
          const proof = tree.getProof({ index: BigInt(4), account: wallets[4].address as Address, amount: BigInt(5) })
          await expect(
            claimWithSignature(distributor, contract, wallets[4], txSigner, {
              index: 4,
              amount: 5,
              merkleProof: proof,
            })
          )
            .to.emit(distributor, 'Claimed')
            .withArgs(4, wallets[4].address, 5)
        })

        it('claim index 9', async () => {
          const proof = tree.getProof({ index: BigInt(9), account: wallets[9].address as Address, amount: BigInt(10) })
          await expect(
            claimWithSignature(distributor, contract, wallets[9], txSigner, {
              index: 9,
              amount: 10,
              merkleProof: proof,
            })
          )
            .to.emit(distributor, 'Claimed')
            .withArgs(9, wallets[9].address, 10)
        })

        it('gas', async () => {
          const proof = tree.getProof({ index: BigInt(9), account: wallets[9].address as Address, amount: BigInt(10) })
          const tx = await claimWithSignature(distributor, contract, wallets[9], txSigner, {
            index: 9,
            amount: 10,
            merkleProof: proof,
          })
          const receipt = await tx.wait()
          expect(receipt.gasUsed).to.be.lte(maxGas[contract].largerTreeFirstClaim)
        })

        it('gas second down about 15k', async () => {
          await expect(
            claimWithSignature(distributor, contract, wallets[0], txSigner, {
              index: 0,
              amount: 1,
              merkleProof: tree.getProof({
                index: BigInt(0),
                account: wallets[0].address as Address,
                amount: BigInt(1),
              }),
            })
          ).not.to.be.reverted
          const tx = await claimWithSignature(distributor, contract, wallets[1], txSigner, {
            index: 1,
            amount: 2,
            merkleProof: tree.getProof({ index: BigInt(1), account: wallets[1].address as Address, amount: BigInt(2) }),
          })
          const receipt = await tx.wait()
          expect(receipt.gasUsed).to.be.lte(maxGas[contract].largerTreeSecondClaim)
        })
      })

      describe('realistic size tree', () => {
        let distributor: Contract
        let tree: ReturnType<typeof createBalanceTree>
        const NUM_LEAVES = 100_000
        const NUM_SAMPLES = 25

        beforeEach('deploy', async () => {
          const elements: { account: Address; amount: bigint }[] = []
          for (let i = 0; i < NUM_LEAVES; i++) {
            const node = { account: wallet0.address as Address, amount: BigInt(100) }
            elements.push(node)
          }
          tree = createBalanceTree({ balances: elements })
          const totalAmount = BigInt(NUM_LEAVES) * BigInt(100)
          await mockToken.setBalance(txSigner.address, totalAmount)
          distributor = await deployContract(
            creatorWallet,
            distributorFactory,
            mockToken,
            tree.getHexRoot(),
            contract,
            txSigner.address,
            totalAmount
          )
          expect(await mockToken.balanceOf(distributor.address)).to.eq(totalAmount)
        })

        it('proof verification works', () => {
          const root = Buffer.from(tree.getHexRoot().slice(2), 'hex')
          for (let i = 0; i < NUM_LEAVES; i += NUM_LEAVES / NUM_SAMPLES) {
            const proof = tree
              .getProof({ index: BigInt(i), account: wallet0.address as Address, amount: BigInt(100) })
              .map((el) => Buffer.from(el.slice(2), 'hex'))
            const validProof = verifyProof({
              index: BigInt(i),
              account: wallet0.address as Address,
              amount: BigInt(100),
              proof,
              root,
            })
            expect(validProof).to.be.true
          }
        })

        it('gas', async () => {
          const proof = tree.getProof({
            index: BigInt(50000),
            account: wallet0.address as Address,
            amount: BigInt(100),
          })
          const tx = await claimWithSignature(distributor, contract, wallet0, txSigner, {
            index: 50000,
            amount: 100,
            merkleProof: proof,
          })
          const receipt = await tx.wait()
          expect(receipt.gasUsed).to.be.lte(maxGas[contract].realisticTreeGas)
        })
        it('gas deeper node', async () => {
          const tx = await claimWithSignature(distributor, contract, wallet0, txSigner, {
            index: 90000,
            amount: 100,
            merkleProof: tree.getProof({
              index: BigInt(90000),
              account: wallet0.address as Address,
              amount: BigInt(100),
            }),
          })
          const receipt = await tx.wait()
          expect(receipt.gasUsed).to.be.lte(maxGas[contract].realisticTreeGasDeeperNode)
        })
        it('gas average random distribution', async () => {
          let total: BigNumber = BigNumber.from(0)
          let count: number = 0
          for (let i = 0; i < NUM_LEAVES; i += NUM_LEAVES / NUM_SAMPLES) {
            const proof = tree.getProof({ index: BigInt(i), account: wallet0.address as Address, amount: BigInt(100) })
            const tx = await claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: i,
              amount: 100,
              merkleProof: proof,
            })
            const receipt = await tx.wait()
            total = total.add(receipt.gasUsed)
            count++
          }
          const average = total.div(count)
          expect(average).to.be.lte(maxGas[contract].realisticTreeGasAverageRandom)
        })
        // this is what we gas golfed by packing the bitmap
        it('gas average first 25', async () => {
          let total: BigNumber = BigNumber.from(0)
          let count: number = 0
          for (let i = 0; i < 25; i++) {
            const proof = tree.getProof({ index: BigInt(i), account: wallet0.address as Address, amount: BigInt(100) })
            const tx = await claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: i,
              amount: 100,
              merkleProof: proof,
            })
            const receipt = await tx.wait()
            total = total.add(receipt.gasUsed)
            count++
          }
          const average = total.div(count)
          expect(average).to.be.lte(maxGas[contract].realisticTreeGasAverageFirst25)
        })

        it('no double claims in random distribution', async () => {
          for (let i = 0; i < 25; i += Math.floor(Math.random() * (NUM_LEAVES / NUM_SAMPLES))) {
            const proof = tree.getProof({ index: BigInt(i), account: wallet0.address as Address, amount: BigInt(100) })
            await claimWithSignature(distributor, contract, wallet0, txSigner, {
              index: i,
              amount: 100,
              merkleProof: proof,
            })
            await expect(
              claimWithSignature(distributor, contract, wallet0, txSigner, {
                index: i,
                amount: 100,
                merkleProof: proof,
              })
            ).to.be.revertedWith('AlreadyClaimed()')
          }
        })
      })

      describe('parseBalanceMap', () => {
        let distributor: Contract
        let claims: {
          [account: string]: {
            index: number
            amount: string
            proof: string[]
          }
        }
        beforeEach('deploy', async () => {
          const {
            claims: innerClaims,
            merkleRoot,
            tokenTotal,
          } = parseBalanceMap({
            balances: [
              { address: wallet0.address as Address, earnings: '200', reasons: '' },
              { address: wallet1.address as Address, earnings: '300', reasons: '' },
              { address: wallets[2].address as Address, earnings: '250', reasons: '' },
            ],
          })
          expect(tokenTotal).to.eq('0x02ee') // 750
          claims = innerClaims
          const totalAmount = BigInt(300) + BigInt(200) + BigInt(250)
          await mockToken.setBalance(txSigner.address, totalAmount)
          distributor = await deployContract(
            creatorWallet,
            distributorFactory,
            mockToken,
            merkleRoot,
            contract,
            txSigner.address,
            totalAmount
          )
          expect(await mockToken.balanceOf(distributor.address)).to.eq(totalAmount)
        })

        it('check the proofs is as expected', () => {
          expect(claims).to.deep.eq({
            [wallet0.address]: {
              index: 2,
              amount: '0xc8',
              proof: [
                '0x0782528e118c4350a2465fbeabec5e72fff06991a29f21c08d37a0d275e38ddd',
                '0xf3c5acb53398e1d11dcaa74e37acc33d228f5da944fbdea9a918684074a21cdb',
              ],
            },
            [wallet1.address]: {
              index: 1,
              amount: '0x12c',
              proof: [
                '0xc86fd316fa3e7b83c2665b5ccb63771e78abcc0429e0105c91dde37cb9b857a4',
                '0xf3c5acb53398e1d11dcaa74e37acc33d228f5da944fbdea9a918684074a21cdb',
              ],
            },
            [wallets[2].address]: {
              index: 0,
              amount: '0xfa',
              proof: ['0x0c9bcaca2a1013557ef7f348b514ab8a8cd6c7051b69e46b1681a2aff22f4a88'],
            },
          })
        })

        it('all claims work exactly once', async () => {
          for (let account in claims) {
            const claim = claims[account]
            const accountWallet = wallets.find((w) => w.address === account)
            if (!accountWallet) {
              throw new Error('Account not found')
            }
            await expect(
              claimWithSignature(distributor, contract, accountWallet, txSigner, {
                index: claim.index,
                amount: parseInt(claim.amount, 16),
                merkleProof: claim.proof,
              })
            )
              .to.emit(distributor, 'Claimed')
              .withArgs(claim.index, account, claim.amount)
            await expect(
              claimWithSignature(distributor, contract, accountWallet, txSigner, {
                index: claim.index,
                amount: parseInt(claim.amount, 16),
                merkleProof: claim.proof,
              })
            ).to.be.revertedWith('AlreadyClaimed()')
          }
          expect(await mockToken.balanceOf(distributor.address)).to.eq(0)
        })
      })
    })
  })
}

describe('#MerkleDistributorWithDeadline', () => {
  let token: Contract
  let wallet0: SignerWithAddress
  let wallet1: SignerWithAddress
  let txSigner: SignerWithAddress
  let creatorWallet: SignerWithAddress
  let wallets: SignerWithAddress[]
  let distributor: Contract
  let tree: ReturnType<typeof createBalanceTree>
  let currentTimestamp = Math.floor(Date.now() / 1000)

  beforeEach('deploy', async () => {
    wallets = await ethers.getSigners()
    wallet0 = wallets[0]
    wallet1 = wallets[1]
    txSigner = wallets[2]
    creatorWallet = wallets[3]

    const tokenFactory = await ethers.getContractFactory('TestERC20', wallet0)
    token = await tokenFactory.deploy('Token', 'TKN', 0, overrides)
    const factoryFactory = await ethers.getContractFactory('MerkleDistributorFactory', wallet0)
    const distributorFactory = await factoryFactory.deploy()

    tree = createBalanceTree({
      balances: [
        { account: wallet0.address as Address, amount: BigInt(100) },
        { account: wallet1.address as Address, amount: BigInt(101) },
      ],
    })

    const totalAmount = BigInt(100) + BigInt(101)

    distributor = await deployContract(
      creatorWallet,
      distributorFactory,
      token,
      tree.getHexRoot(),
      'MerkleDistributorWithDeadline',
      txSigner.address,
      totalAmount,
      currentTimestamp + 31536000
    )
  })

  it('successful claim', async () => {
    await expect(
      claimWithSignature(distributor, 'MerkleDistributorWithDeadline', wallet0, txSigner, {
        index: 0,
        amount: 100,
        merkleProof: tree.getProof({ index: BigInt(0), account: wallet0.address as Address, amount: BigInt(100) }),
      })
    )
      .to.emit(distributor, 'Claimed')
      .withArgs(0, wallet0.address, 100)
  })

  it('only owner can withdraw', async () => {
    const tx = distributor.connect(wallet1).withdraw(overrides)
    await expect(tx).to.be.revertedWith('Ownable: caller is not the owner')
  })

  it('cannot withdraw during claim window', async () => {
    const tx = distributor.connect(creatorWallet).withdraw(overrides)
    await expect(tx).to.be.revertedWith('NoWithdrawDuringClaim()')
  })

  it('cannot claim after end time', async () => {
    const oneSecondAfterEndTime = currentTimestamp + 31536001
    await ethers.provider.send('evm_mine', [oneSecondAfterEndTime])
    currentTimestamp = oneSecondAfterEndTime
    await expect(
      claimWithSignature(distributor, 'MerkleDistributorWithDeadline', wallet0, txSigner, {
        index: 0,
        amount: 100,
        merkleProof: tree.getProof({ index: BigInt(0), account: wallet0.address as Address, amount: BigInt(100) }),
      })
    ).to.be.revertedWith('ClaimWindowFinished()')
  })

  it('can withdraw after end time', async () => {
    const oneSecondAfterEndTime = currentTimestamp + 31536001
    await ethers.provider.send('evm_mine', [oneSecondAfterEndTime])
    currentTimestamp = oneSecondAfterEndTime
    expect(await token.balanceOf(creatorWallet.address)).to.eq(0)
    await distributor.connect(creatorWallet).withdraw(overrides)
    expect(await token.balanceOf(creatorWallet.address)).to.eq(201)
  })

  it('only owner can withdraw even after end time', async () => {
    const oneSecondAfterEndTime = currentTimestamp + 31536001
    await ethers.provider.send('evm_mine', [oneSecondAfterEndTime])
    currentTimestamp = oneSecondAfterEndTime
    distributor = distributor.connect(wallet1)
    await expect(distributor.withdraw(overrides)).to.be.revertedWith('Ownable: caller is not the owner')
  })

  describe('rescue tokens', () => {
    let randomToken: Contract
    beforeEach('deploy', async () => {
      const tokenFactory = await ethers.getContractFactory('TestERC20', wallet0)
      randomToken = await tokenFactory.deploy('TokenOops', 'PLZGIVEBACK', 0, overrides)
      await randomToken.setBalance(distributor.address, 100)
    })
    it('only owner can rescue token', async () => {
      const tx = distributor.connect(wallet0).rescueToken(token.address, overrides)
      await expect(tx).to.be.revertedWith('Ownable: caller is not the owner')
    })
    it('cannot rescue the distributed token', async () => {
      const tx = distributor.connect(creatorWallet).rescueToken(token.address, overrides)
      await expect(tx).to.be.revertedWith('InvalidRescue()')
    })
    it('owner can rescue any other token', async () => {
      expect(await randomToken.balanceOf(creatorWallet.address)).to.eq(0)
      const tx = distributor.connect(creatorWallet).rescueToken(randomToken.address, overrides)
      await expect(tx).not.to.be.reverted
      expect(await randomToken.balanceOf(creatorWallet.address)).to.eq(100)
    })
  })
})
