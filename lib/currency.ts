export const formatCurrency = (amount: number, currency?: string) => {
  // If currency is not provided, try to detect it
  const activeCurrency = currency || detectCurrency();

  const formatter = new Intl.NumberFormat(activeCurrency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: activeCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
};

export const detectCurrency = () => {
    // 1. Check if we are in a browser environment
    if (typeof window !== 'undefined') {
        // Simple check based on timezone for MVP
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz === 'Asia/Kolkata' || tz.startsWith('Asia/Calcutta')) {
            return 'INR';
        }
    }
    
    // Default to USD
    return 'USD';
};

export const getExchangeRate = () => {
    // Static rate for reliability in MVP
    return 83.5; 
};

export const convertToINR = (usdAmount: number) => {
    return usdAmount * getExchangeRate();
};

export const autoConvert = (usdAmount: number) => {
    const currency = detectCurrency();
    if (currency === 'INR') {
        return {
            amount: convertToINR(usdAmount),
            currency: 'INR'
        };
    }
    return {
        amount: usdAmount,
        currency: 'USD'
    };
};
