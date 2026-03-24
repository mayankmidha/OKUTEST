export const formatCurrency = (amount: number, currency: string = 'USD') => {
  const formatter = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
};

export const getExchangeRate = () => {
    // Static rate for reliability in MVP, can be updated to live API
    return 83.5; 
};

export const convertToINR = (usdAmount: number) => {
    return usdAmount * getExchangeRate();
};
