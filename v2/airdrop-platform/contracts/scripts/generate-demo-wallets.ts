import { mnemonicToAccount } from 'viem/accounts'

// same one used in viem's docs
const PUBLIC_MNEMONIC = 'legal winner thank year wave sausage worth useful legal winner thank yellow'

const main = async () => {
  for (let i = 0; i < 1_000; i++) {
    const account = mnemonicToAccount(PUBLIC_MNEMONIC, { accountIndex: 0, addressIndex: i })

    // random bigint amount between 1 and 1000000000000000000 (1e18)
    const amount = BigInt(Math.floor(Math.random() * 1e18) + 1)

    console.log(`${account.address},${amount}`)
  }
}

main()
