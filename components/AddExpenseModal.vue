<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="card max-w-md w-full">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold">Add Expense</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <X class="w-6 h-6" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="description" class="block text-sm font-medium mb-2">Description</label>
          <input
            id="description"
            v-model="description"
            type="text"
            required
            class="input-field"
            placeholder="What did you pay for?"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-2">Currency</label>
          <div class="flex gap-3">
            <label class="flex items-center">
              <input
                v-model="currency"
                type="radio"
                value="EUR"
                class="mr-2 text-bitcoin focus:ring-bitcoin"
              />
              EUR (€)
            </label>
            <label class="flex items-center">
              <input
                v-model="currency"
                type="radio"
                value="SATS"
                class="mr-2 text-bitcoin focus:ring-bitcoin"
              />
              Satoshis
            </label>
          </div>
        </div>

        <div>
          <label for="amount" class="block text-sm font-medium mb-2">
            Amount {{ currency === 'EUR' ? '(€)' : '(sats)' }}
          </label>
          <input
            id="amount"
            v-model.number="amount"
            type="number"
            :step="currency === 'EUR' ? '0.01' : '1'"
            required
            class="input-field"
            :placeholder="currency === 'EUR' ? '0.00' : '0'"
          />
        </div>

        <div v-if="amount && bitcoinPrice.bitcoinPrice" class="text-sm text-gray-600 dark:text-gray-400">
          <div v-if="currency === 'EUR'">
            ≈ {{ bitcoinPrice.formatSatoshis(bitcoinPrice.eurToSatoshis(amount)) }}
          </div>
          <div v-else>
            ≈ {{ bitcoinPrice.formatEur(bitcoinPrice.satoshisToEur(amount)) }}
          </div>
        </div>

        <div class="flex gap-3">
          <button type="button" @click="$emit('close')" class="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" :disabled="loading" class="btn-primary flex-1">
            <span v-if="loading">Adding...</span>
            <span v-else>Add Expense</span>
          </button>
        </div>
      </form>

      <div v-if="error" class="mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded-lg">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  groupId: string
}>()

const emit = defineEmits<{
  close: []
  added: []
}>()

const expensesStore = useExpensesStore()
const bitcoinPrice = useBitcoinPrice()

const description = ref('')
const amount = ref<number>()
const currency = ref<'EUR' | 'SATS'>('EUR')
const loading = ref(false)
const error = ref('')

onMounted(() => {
  bitcoinPrice.fetchBitcoinPrice()
})

watch(currency, () => {
  amount.value = undefined
})

const handleSubmit = async () => {
  if (!amount.value) return

  loading.value = true
  error.value = ''
  
  // Use primitive values, not objects which might have cycles
  const priceInEUR = bitcoinPrice.bitcoinPrice || null
  const formattedAmount = currency.value === 'EUR'
    ? bitcoinPrice.formatSatoshis(bitcoinPrice.eurToSatoshis(amount.value))
    : bitcoinPrice.formatEur(bitcoinPrice.satoshisToEur(amount.value))
  console.log({priceInEUR: priceInEUR.value})
  try {
    console.log('Submitting expense:', {
      groupId: props.groupId,
      description: description.value,
      amount: amount.value,
      currency: currency.value,
      formattedAmount
    })

    await expensesStore.addExpense(
      props.groupId,
      description.value,
      amount.value,
      currency.value,
      Number(priceInEUR.value)
    )
    description.value = ''
    amount.value = undefined
    emit('added')
    emit('close')
  } catch (err: any) {
    error.value = err.message || 'Failed to add expense'
  } finally {
    loading.value = false
  }
}
</script>