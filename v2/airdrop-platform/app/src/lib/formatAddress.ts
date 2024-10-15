export const formatAddress = (address?: string, showLetters = 4): string => {
  if (address === undefined) return "...";
  if (address.length < 2 + 2 * showLetters) return address;
  return `${address.slice(0, 2 + showLetters)}...${address.slice(-showLetters)}`;
};
