export const useBitcoinPrice = () => {
  const bitcoinPrice = ref<number>(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchBitcoinPrice = async () => {
    bitcoinPrice.value = 100000;
    return;
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur')
      const data = await response.json()
      bitcoinPrice.value = data.bitcoin.eur
    } catch (err) {
      error.value = 'Failed to fetch Bitcoin price'
      console.error('Bitcoin price fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const eurToSatoshis = (eurAmount: number): number => {
    if (bitcoinPrice.value === 0) return 0
    const btcAmount = eurAmount / bitcoinPrice.value
    return Math.round(btcAmount * 100_000_000) // Convert BTC to satoshis
  }

  const satoshisToEur = (satoshis: number): number => {
    if (bitcoinPrice.value === 0) return 0
    const btcAmount = satoshis / 100_000_000 // Convert satoshis to BTC
    return btcAmount * bitcoinPrice.value
  }

  const formatSatoshis = (satoshis: number): string => {
    return new Intl.NumberFormat().format(satoshis) + ' sats'
  }

  const formatEur = (amount: number): string => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  return {
    bitcoinPrice: readonly(bitcoinPrice),
    loading: readonly(loading),
    error: readonly(error),
    fetchBitcoinPrice,
    eurToSatoshis,
    satoshisToEur,
    formatSatoshis,
    formatEur
  }
}