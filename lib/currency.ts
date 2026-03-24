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

export const detectCurrency = (location?: string) => {
    // 1. If location is explicitly provided (e.g. from user profile)
    if (location) {
        if (location === 'USA') return 'USD';
        if (location === 'Australia') return 'AUD';
        if (location === 'Canada') return 'CAD';
        if (location === 'Saudi Arabia') return 'SAR';
        if (location === 'India') return 'INR';
    }

    // 2. Fallback to browser environment detection
    if (typeof window !== 'undefined') {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz === 'Asia/Kolkata' || tz.startsWith('Asia/Calcutta')) {
            return 'INR';
        }
        // Add more timezone to currency mappings if needed
    }
    
    // Default to INR as per requirements
    return 'INR';
};

export const getExchangeRate = (targetCurrency: string) => {
    // Static rates for MVP reliability
    const rates: Record<string, number> = {
        'USD': 1,
        'INR': 83.5,
        'AUD': 1.52,
        'CAD': 1.35,
        'SAR': 3.75
    };
    return rates[targetCurrency] || 1;
};

export const convertCurrency = (amount: number, from: string, to: string) => {
    if (from === to) return amount;
    // Standardize to USD first
    const usdAmount = from === 'USD' ? amount : amount / getExchangeRate(from);
    // Convert to target
    return usdAmount * getExchangeRate(to);
};

export const autoConvert = (usdAmount: number, userLocation?: string) => {
    const currency = detectCurrency(userLocation);
    return {
        amount: convertCurrency(usdAmount, 'USD', currency),
        currency: currency
    };
};

export const convertToINR = (usdAmount: number) => {
    return convertCurrency(usdAmount, 'USD', 'INR');
};
