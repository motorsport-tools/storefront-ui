export const formatNumber = (value?: string | number): string => {
    if (!value) return '0'

    const numberValue = typeof value === 'string' ? parseFloat(value) : value

    if (Number.isInteger(numberValue)) {
        return new Intl.NumberFormat('en-UK').format(numberValue)
    }

    return new Intl.NumberFormat('en-UK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numberValue)
}