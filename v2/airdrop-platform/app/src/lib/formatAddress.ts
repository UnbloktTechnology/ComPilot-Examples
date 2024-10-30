export const formatAddress = (
  address?: string,
  showLetters = 4,
  prefix = 2,
): string => {
  if (address === undefined) return "...";
  if (showLetters >= (address.length - prefix) / 2) return address;
  return `${address.slice(0, 2 + showLetters)}...${address.slice(-showLetters)}`;
};
