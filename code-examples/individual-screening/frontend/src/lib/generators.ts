// Ajout de la liste des codes pays
const euCountryCodes = ['SVN', 'FRA', 'DEU', 'ITA', 'ESP', 'BEL', 'NLD', 'PRT', 'GRC', 'AUT'];

export const generateRandomWallet = () => {
  return `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
};

export const generateRandomEmail = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const length = Math.floor(Math.random() * 10) + 5;
  const randomString = Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${randomString}@gmail.com`;
};

export const generateRandomPhone = () => {
  const numbers = Array.from({length: 9}, () => Math.floor(Math.random() * 10)).join('');
  return `+${Math.floor(Math.random() * 900) + 100}-${numbers.slice(0,3)}-${numbers.slice(3,6)}-${numbers.slice(6)}`;
};

export const generateRandomName = () => {
  const names = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona'];
  const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  
  return {
    firstName: names[Math.floor(Math.random() * names.length)],
    lastName: surnames[Math.floor(Math.random() * surnames.length)]
  };
};

export const generateRandomCountryCode = (forceCountry?: 'EU' | 'US') => {
  if (forceCountry === 'US') return 'USA';
  if (forceCountry === 'EU') return euCountryCodes[Math.floor(Math.random() * euCountryCodes.length)];
  return euCountryCodes[Math.floor(Math.random() * euCountryCodes.length)];
};

export const generateRandomAge = (isUnder18: boolean = false) => {
  if (isUnder18) {
    return Math.floor(Math.random() * 2) + 16; // 16-17
  }
  return Math.floor(Math.random() * 59) + 18; // 18-77
}; 