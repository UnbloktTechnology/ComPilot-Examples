export const TEST_USERS = [
  {
    id: "1",
    name: "Alice",
    avatar: "alice-user",
    walletAddress: "0x9BE9B6032264D9Bc0605f4bBeA8F60A77F7b2bB8",
    privateKey:
      "eb88efb22ce3526dee6fbedb2057c5285199a36b9045d35404588eb9b7070365",
  },
  {
    id: "2",
    name: "Bob",
    avatar: "bob-user",
    walletAddress: "0xf7E7A46AB882D4d0986292d3BD7d2a40F75002E6",
    privateKey:
      "37ac909b525919f9787b6ccf78f2bc3c558855e9551426afb98cb106e68fae5c",
  },
  {
    id: "3",
    name: "Carol",
    avatar: "carol-user",
    walletAddress: "0x6cA64ec25DF05E6d0BDB689e95C7bd623a3d7919",
    privateKey:
      "62603af2208c6e28d95084bc5262cb41bdb0cac95c3cb3ab009e8bde96a08985",
  },
  {
    id: "4",
    name: "Dave",
    avatar: "dave-user",
    walletAddress: "0x63a1bD42436b7f97607Ba88DD9ea62C1e261e7F9",
    privateKey:
      "a609e0288af6bf3b1aa89a6ee7d809e423f7bf41b7b9c14759376df8d17d40ec",
  },
] as const;

export type TestUser = (typeof TEST_USERS)[number];
