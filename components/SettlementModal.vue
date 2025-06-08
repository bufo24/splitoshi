<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold flex items-center gap-2">
          <Zap class="w-6 h-6 text-lightning" />
          Settlement Summary
        </h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <X class="w-6 h-6" />
        </button>
      </div>

      <div class="space-y-6">
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 class="font-medium mb-3">Group Balances</h4>
          <div class="space-y-2">
            <div
              v-for="[id, balance] in balances"
              :key="id"
              class="flex justify-between items-center"
            >
              <span class="text-sm">{{ groupMembers.find(member => member.user.id === id)?.user.email }}</span>
              <span
                :class="{
                  'text-green-600 dark:text-green-400': balance > 0,
                  'text-red-600 dark:text-red-400': balance < 0,
                  'text-gray-600 dark:text-gray-400': balance === 0
                }"
                class="font-medium"
              >
                {{ formatEur(satoshisToEur(balance)) }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="settlements.length > 0">
          <h4 class="font-medium mb-3">Suggested Lightning Payments</h4>
          <div class="space-y-3">
            <div
              v-for="(settlement, idx) in settlements"
              :key="`${settlement.from}-${settlement.to}`"
              class="bg-gradient-to-r from-bitcoin/10 to-lightning/10 rounded-lg p-4 border border-bitcoin/20"
            >
              <div class="flex justify-between items-start mb-3">
                <div>
                  <p class="font-medium">
                    {{ settlement.from }} → {{ settlement.to }}
                  </p>
                  <p class="text-2xl font-bold text-bitcoin">
                    {{ formatEur(+satoshisToEur(settlement.amount).toFixed(2)) }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    ≈ {{ formatSatoshis(settlement.amount) }}
                  </p>
                </div>
                <Zap class="w-8 h-8 text-lightning" />
              </div>
              
              <div v-if="settlement.toLightningAddress" class="space-y-2">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Lightning Address: {{ settlement.toLightningAddress }}
                </p>
                <button
                  @click="generateInvoice(idx)"
                  class="btn-primary text-sm w-full"
                  :disabled="settlement.generating"
                >
                  <span v-if="settlement.generating">Generating Invoice...</span>
                  <span v-else class="flex items-center justify-center gap-2">
                    <Zap class="w-4 h-4" />
                    Generate Lightning Invoice
                  </span>
                </button>
                
                <div v-if="settlement.invoice" class="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded border">
                  <p class="text-xs font-mono break-all mb-2">{{ settlement.invoice }}</p>
                  <button
                    @click="copyToClipboard(settlement.invoice)"
                    class="btn-secondary text-sm w-full"
                  >
                    Copy Invoice
                  </button>
                  <button class="btn-secondary text-sm w-full" @click="createSettlement(idx)">
                    Paid!
                  </button>
                </div>
              </div>
              
              <!-- <div v-else class="text-sm text-gray-600 dark:text-gray-400">
                {{ settlement.toEmail }} hasn't set up a Lightning address yet.
              </div> -->
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <CheckCircle class="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p class="text-lg font-medium">All settled!</p>
          <p class="text-gray-600 dark:text-gray-400">No payments needed in this group.</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { GroupMember, User } from '@prisma/client';
import { X, Zap, CheckCircle } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  groupMembers: (GroupMember & {user: User})[]
  balances: Map<string, number>,
  groupId: string,
}>()
const emit = defineEmits<{
  close: []
}>()

const bitcoinPrice = useBitcoinPrice()
let settlements = reactive<Settlement[]>([]);

// Define the PaymentInstruction type
interface PaymentInstruction {
  from: string;
  to: string;
  balance: number;
}

const membersWithBalances = computed(() => {
  const paymentInstructions: PaymentInstruction[] = [];

  for (const [transaction, balance] of props.balances.entries()) {
    const [debtorId, creditorId] = transaction.split('->');
    paymentInstructions.push({
      from: debtorId,
      to: creditorId,
      balance
    });
    paymentInstructions.push({
      from: creditorId,
      to: debtorId,
      balance: balance * -1
    });
  }
  return paymentInstructions;
})

type Settlement = {
  from: string,
  to: string,
  toLightningAddress: string,
  amount: number,
  generating: boolean,
  invoice?: string
}

const getSettlements = () => {
  const creditors = membersWithBalances.value.filter(m => m.balance > 0);
  const debtors = membersWithBalances.value.filter(m => m.balance < 0);

  const result: Settlement[] = [];
  for (const debtor of debtors) {
    let remainingDebt = Math.abs(debtor.balance);

    for (const creditor of creditors) {
      if (remainingDebt <= 0 || creditor.balance <= 0) {
        continue;
      }
      const paymentAmount = Math.min(remainingDebt, creditor.balance);
      const lnAddress = props.groupMembers.find(member => member.user_id === creditor.to)?.user.lightning_address;
      if (!lnAddress) throw new Error(`All members need a Lightning Address`);
      console.log({creditor,debtor})
      result.push({
        from: debtor.from,
        to: debtor.to,
        toLightningAddress: lnAddress,
        amount: paymentAmount,
        generating: false,
        invoice: undefined
      });

      remainingDebt -= paymentAmount;
      creditor.balance -= paymentAmount;

      if (creditor.balance <= 0) {
        break;
      }
    }
  }
  return result;
}


const { formatEur, formatSatoshis, satoshisToEur } = bitcoinPrice

const generateInvoice = async (idx: number) => {
  settlements[idx].generating = true
  const amount = settlements[idx].amount;

  const lnAddress = settlements[idx].toLightningAddress;
  const [username, domain] = lnAddress.split('@');
  try {
    const addressUrl = `https://${domain}/.well-known/lnurlp/${username}`;
    const callbackObj = await fetch(addressUrl);
    const callbackUrl = (await callbackObj.json()).callback;
    const invoiceUrl = new URL(callbackUrl);
    invoiceUrl.searchParams.append('amount', (amount * 1000).toString())

    const invoiceObj = await fetch(invoiceUrl);
    const invoice = (await invoiceObj.json()).pr;

    settlements[idx].invoice = invoice;
  } catch (error) {
    console.error('Failed to generate invoice:', error)
  } finally {
    settlements[idx].generating = false
  }
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

const createSettlement = async (idx: number) => {
  const settlement = settlements.at(idx);
  if (!settlement) return;

  const {amount,from,to} = settlement;
 
  try {
    // Call the join group API
    await $fetch('/api/settlements', {
      method: 'POST',
      body: { groupId: props.groupId, fromUserId: from, toUserId: to, amount }
    })
    console.log('created settlement');
    
  } catch (error) {
    console.error('Failed to create settlement:', error)
    
  }
}

onMounted(() => {
  bitcoinPrice.fetchBitcoinPrice()
  Object.assign(settlements, getSettlements());
  console.log({settlements: toRaw(settlements)})
})
</script>