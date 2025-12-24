/**
 * Format a number as Indonesian Rupiah currency
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    }).format(value);
}

/**
 * Format a number as Indonesian Rupiah without currency symbol
 */
export function formatNumber(value: number, decimals: number = 0): string {
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}
