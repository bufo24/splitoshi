import type { Expense, Settlement } from '@prisma/client'
import { defineStore } from 'pinia'

type DebCred = {memberId: string, amount: number};

export const useExpensesStore = defineStore('expenses', () => {
  const api = useApi()
  const expenses = ref<Expense[]>([])
  const settlements = ref<Settlement[]>([])
  const loading = ref(false)

  const fetchExpenses = async (groupId: string) => {
    loading.value = true
    try {
      const response = await api.get<{ expenses: Expense[], settlements: Settlement[] }>(`/api/groups/${groupId}/expenses`)
      expenses.value = response.expenses
      settlements.value = response.settlements;
    } finally {
      loading.value = false
    }
  }

  const addExpense = async (
    groupId: string,
    description: string,
    amount: number,
    currency: 'EUR' | 'SATS',
    bitcoinPrice: number
  ) => {
    const response = await api.post<{ expense: Expense }>(`/api/groups/${groupId}/expenses`, {groupId,description,amount,currency,bitcoin_price: bitcoinPrice});
    
    await fetchExpenses(groupId)
    return response.expense
  }

  const calculateBalances = (groupExpenses: Expense[], memberIds: string[]) => {
    if (memberIds.length === 0) return new Map<string, number>()

    // Step 1: Calculate net balance for each member
    const netBalances = new Map<string, number>()
    memberIds.forEach(memberId => {
      netBalances.set(memberId, 0)
    })
    
    groupExpenses.forEach(expense => {
      const currentBalance = netBalances.get(expense.user_id) || 0
      netBalances.set(expense.user_id, currentBalance +Number(expense.amount_satoshis))
    })

    const totalAmount = groupExpenses.reduce((sum, expense) => sum + Number(expense.amount_satoshis), 0)
    const perPersonShare = totalAmount / memberIds.length
    // Step 2: Adjust balances by subtracting per person share
    memberIds.forEach(memberId => {
      const adjustedBalance = (netBalances.get(memberId) || 0) - perPersonShare
      netBalances.set(memberId, adjustedBalance)
    })

    // Step 3: Calculate pending balances to settle debts
    const pendingBalances = new Map<string, number>()
    let creditors: DebCred[] = [] // Members who should receive money
    let debtors: DebCred[] = [] // Members who owe money

    netBalances.forEach((balance, memberId) => {
      if (balance > 0) {
        creditors.push({memberId, amount: balance})
      } else if (balance < 0) {
        debtors.push({memberId, amount: -balance})
      }
    })

    creditors.sort((a, b) => b.amount - a.amount)
    debtors.sort((a, b) => b.amount - a.amount)
    // Settle debts
    debtors.forEach(debtor => {
      while (debtor.amount > 0 && creditors.length > 0) {
        const creditor = creditors[0]
        if (!creditor) break;

        const settleAmount = Math.min(debtor.amount, creditor.amount)

        debtor.amount -= settleAmount
        creditor.amount -= settleAmount

        pendingBalances.set(debtor.memberId + '->' + creditor.memberId, settleAmount)

        if (creditor.amount === 0) {
          creditors.shift() // Remove settled creditor
        }
      }
    })

    return pendingBalances
  }

  return {
    expenses: expenses,
    settlements,
    loading: loading,
    fetchExpenses,
    addExpense,
    calculateBalances
  }
})