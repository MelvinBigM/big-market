
// Helper functions for price calculations and product information

/**
 * Extracts quantity from product name (formats like "x24", "x12", "x6", "x1")
 */
export const extractQuantity = (productName: string): number => {
  // Search for patterns like "x24", "x12", "x6", "x1" at the end of the name
  const match = productName.match(/x(\d+)$/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return 1; // Default to 1 if no quantity is found
};

/**
 * Calculates the price with VAT included
 */
export const calculatePriceTTC = (priceHT: number, vatRate: number = 5.5): number => {
  return priceHT * (1 + vatRate / 100);
};
