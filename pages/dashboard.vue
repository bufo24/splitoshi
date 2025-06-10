<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-3">
            <Zap class="w-8 h-8 text-bitcoin" />
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">Splitoshi</h1>
          </div>
          
          <div class="flex items-center gap-4">
            <!-- Theme Toggle -->
            <button
              @click="toggleColorMode"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Sun v-if="$colorMode.value === 'dark'" class="w-5 h-5" />
              <Moon v-else class="w-5 h-5" />
            </button>
            
            <!-- User Menu -->
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ authStore.user?.email }}</span>
              <button
                @click="handleSignOut"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <LogOut class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Bitcoin Price Banner -->
      <div class="mb-6 p-4 bg-gradient-to-r from-bitcoin to-lightning rounded-xl text-white">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-90">Bitcoin Price</p>
            <p class="text-2xl font-bold">
              {{ bitcoinPrice.formatEur(bitcoinPrice.bitcoinPrice.value) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm opacity-90">Last Updated</p>
            <p class="text-sm">{{ new Date().toLocaleTimeString() }}</p>
          </div>
        </div>
      </div>

      <!-- Lightning Address Setup -->
      <div v-if="!authStore.user?.lightning_address" class="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div class="flex items-start gap-3">
          <AlertTriangle class="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div class="flex-1">
            <h3 class="font-medium text-yellow-800 dark:text-yellow-200">Set up Lightning Address</h3>
            <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Add your Lightning address to receive Bitcoin payments from group settlements.
            </p>
            <div class="mt-3 flex gap-2">
              <input
                v-model="lightningAddress"
                type="text"
                placeholder="your@lightning.address"
                class="flex-1 px-3 py-1 text-sm border border-yellow-300 dark:border-yellow-700 rounded bg-white dark:bg-gray-800"
              />
              <button
                @click="updateLightningAddress"
                :disabled="updatingAddress"
                class="px-3 py-1 text-sm bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
              >
                {{ updatingAddress ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </div>
        </div>
      </div>

<!-- Join Group by ID Section -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Join a Group by ID</h2>
        </div>
        
        <div class="flex gap-2 items-center">
          <input
            v-model="joinGroupId"
            type="text"
            placeholder="Enter Group ID"
            class="flex-1 p-2 border rounded bg-white dark:bg-gray-800"
          />
          <button
            @click="joinGroup"
            class="btn-primary"
          >
            Join Group
          </button>
        </div>

        <div v-if="joinError" class="mt-2 text-red-500">
          {{ joinError }}
        </div>
      </div>

      
      <!-- Groups Section -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Your Groups</h2>
          <button
            @click="showCreateGroupModal = true"
            class="btn-primary flex items-center gap-2"
          >
            <Plus class="w-5 h-5" />
            New Group
          </button>
        </div>

        <div v-if="groupsStore.loading" class="text-center py-8">
          <div class="inline-block w-8 h-8 border-2 border-bitcoin border-t-transparent rounded-full animate-spin"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">Loading groups...</p>
        </div>

        <div v-else-if="groupsStore.groups.length === 0" class="text-center py-12">
          <Users class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p class="text-xl font-medium text-gray-900 dark:text-white mb-2">No groups yet</p>
          <p class="text-gray-600 dark:text-gray-400 mb-6">Create your first group to start tracking expenses</p>
          <button
            @click="showCreateGroupModal = true"
            class="btn-primary"
          >
            Create Group
          </button>
        </div>

        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="group in groupsStore.groups"
          :key="group.id"
          @click="selectGroup(group)"
          class="card hover:shadow-xl cursor-pointer transition-all duration-200 hover:scale-105"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ group.name }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ group.description || 'No description' }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click.stop="copyGroupId(group.id)"
                class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Copy ID
              </button>
              <div class="bg-bitcoin/10 p-2 rounded-lg">
                <Users class="w-5 h-5 text-bitcoin" />
              </div>
            </div>
          </div>
          
          <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{{ group.members?.length || 0 }} members</span>
            <span>{{ new Date(group.created_at).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>
    </div>

      
      <!-- Selected Group Details -->
      <div v-if="selectedGroup" class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ selectedGroup.name }}</h2>
            <p class="text-gray-600 dark:text-gray-400">{{ selectedGroup.description }}</p>
          </div>
          <div class="flex gap-3">
            <button
              @click="showSettlement = true"
              class="btn-secondary flex items-center gap-2"
            >
              <Zap class="w-5 h-5" />
              Settle Up
            </button>
            <button
              @click="showAddExpenseModal = true"
              class="btn-primary flex items-center gap-2"
            >
              <Plus class="w-5 h-5" />
              Add Expense
            </button>
          </div>
        </div>

        <!-- Group Members -->
        <div class="card">
          <h3 class="text-lg font-semibold mb-4">Group Members</h3>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="member in groupMembers"
              :key="member.id"
              class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div class="w-8 h-8 bg-bitcoin text-white rounded-full flex items-center justify-center text-sm font-medium">
                {{ member.user.email.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{{ member.user.email }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ member.user.lightning_address || 'No Lightning address' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Expenses -->
        <div class="card">
          <h3 class="text-lg font-semibold mb-4">Recent Expenses</h3>
          
          <div v-if="expensesStore.loading" class="text-center py-8">
            <div class="inline-block w-6 h-6 border-2 border-bitcoin border-t-transparent rounded-full animate-spin"></div>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading expenses...</p>
          </div>
          
          <div v-else-if="transactions.length === 0" class="text-center py-8">
            <Receipt class="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p class="text-gray-600 dark:text-gray-400">No expenses yet</p>
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="(tx, idx) in transactions"
              :key="idx"
              class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
            <div v-if="tx.type == 'settlement'">
              <div  class="flex-1">
                <p class="font-medium">{{ tx.confirmed }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  by {{ tx.from }} • <span v-if="!tx.confirmed">Pending...</span>
                </p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-lg">{{ bitcoinPrice.formatEur(tx.amount) }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ bitcoinPrice.formatSatoshis(+tx.amount) }}
                </p>
              </div>
            </div>
            <div v-else>
              <div  class="flex-1">
                <p class="font-medium">{{ tx.description }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  by {{ tx.user_id }} • {{ new Date(tx.created_at).toLocaleDateString() }}
                </p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-lg">{{ bitcoinPrice.formatSatoshis(tx.amount) }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ bitcoinPrice.formatSatoshis(+tx.amount) }}
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CreateGroupModal
      :isOpen="showCreateGroupModal"
      @close="showCreateGroupModal = false"
      @created="handleGroupCreated"
    />
    
    <AddExpenseModal
      v-if="selectedGroup"
      :isOpen="showAddExpenseModal"
      :groupId="selectedGroup.id"
      @close="showAddExpenseModal = false"
      @added="handleExpenseAdded"
    />
    
    <SettlementModal
      v-if="selectedGroup && showSettlement"
      :isOpen="showSettlement"
      :groupMembers="groupMembers"
      :balances="groupBalances"
      :groupId="selectedGroup.id"
      @close="showSettlement = false"
    />
  </div>
</template>

<script setup lang="ts">
import type { Group, GroupMember, User } from '@prisma/client'
import { 
  Zap, LogOut, Plus, Users, Receipt, Sun, Moon, AlertTriangle
} from 'lucide-vue-next'

const joinGroupId = ref('')   // Reactive variable for storing the input groupId
const joinError = ref('')     // Reactive variable for storing error messages

const authStore = useAuthStore()
const groupsStore = useGroupsStore()
const expensesStore = useExpensesStore()
const bitcoinPrice = useBitcoinPrice()
const colorMode = useColorMode()
const router = useRouter()

const selectedGroup = ref<Group | null>(null)
const groupMembers = ref<(GroupMember & {user: User})[]>([])
const groupBalances = computed(() => {
  if (!selectedGroup.value || !groupMembers.value.length) {
    return new Map<string,number>()
  }
  
  const memberIds = groupMembers.value.map(m => m.user_id)
  return expensesStore.calculateBalances(expensesStore.expenses, memberIds)
})

const showCreateGroupModal = ref(false)
const showAddExpenseModal = ref(false)
const showSettlement = ref(false)
const lightningAddress = ref('')
const updatingAddress = ref(false)

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const handleSignOut = async () => {
  await authStore.signOut()
  router.push('/')
}

const selectGroup = async (group: any) => {
  selectedGroup.value = group
  groupsStore.setCurrentGroup(group)
  
  // Fetch group members and expenses
  const [members] = await Promise.all([
    groupsStore.fetchGroupMembers(group.id),
    expensesStore.fetchExpenses(group.id)
  ])

  groupMembers.value = members.map((m) => ({...m, joined_at: new Date(m.joined_at)}))
}

const handleGroupCreated = () => {
  groupsStore.fetchGroups()
}

const handleExpenseAdded = () => {
  if (selectedGroup.value) {
    expensesStore.fetchExpenses(selectedGroup.value.id)
  }
}

const updateLightningAddress = async () => {
  if (!lightningAddress.value.trim()) return
  
  updatingAddress.value = true
  try {
    await authStore.updateLightningAddress(lightningAddress.value.trim())
    lightningAddress.value = ''
  } catch (error) {
    console.error('Failed to update Lightning address:', error)
  } finally {
    updatingAddress.value = false
  }
}

const joinGroup = async () => {
  if (!joinGroupId.value.trim()) {
    joinError.value = 'Please enter a valid group ID.'
    return
  }
  
  try {
    joinError.value = ''
    // Call the join group API
    await $fetch('/api/groups/join', {
      method: 'POST',
      body: { groupId: joinGroupId.value.trim() }
    })
    
    // Refetch groups or handle UI update accordingly
    await groupsStore.fetchGroups()
    
    joinGroupId.value = ''
    joinError.value = ''
  } catch (error) {
    console.error('Failed to join group:', error)
    joinError.value = 'Failed to join group. Please try again.'
  }
}

const copyGroupId = async (groupId: string) => {
  try {
    await navigator.clipboard.writeText(groupId)
    console.log('Group ID copied to clipboard:', groupId)
    alert('Group ID copied to clipboard!')
  } catch (error) {
    console.error('Failed to copy Group ID:', error)
    alert('Failed to copy Group ID.')
  }
}

enum TxType { 'expense' = 'expense', 'settlement' = 'settlement' };

type Tx = {
  type: TxType.settlement;
  amount: number;
  from: string; to: string; confirmed: boolean; created_at: Date;
} | {
  type: TxType.expense; amount: number; user_id: string; description: string; created_at: Date;
}

const transactions = computed((): Tx[] => {
  const {settlements,expenses} = expensesStore;
  console.log({settlements, expenses})
  const txList = [...settlements, ...expenses].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return txList.map((tx) => {
    if ('description' in tx) {
      return {type: TxType.expense, amount: Number(tx.amount_satoshis), user_id: tx.user_id, description: tx.description, created_at: tx.created_at};
    }
      return {type: TxType.settlement, amount: Number(tx.amount), from: tx.from_user_id, to: tx.to_user_id, confirmed: tx.received_confirmed, created_at: tx.created_at};
  })
})

onMounted(async () => {
  await authStore.getCurrentUser()
  if (!authStore.user) {
    router.push('/')
    return
  }
  
  await Promise.all([
    groupsStore.fetchGroups(),
    bitcoinPrice.fetchBitcoinPrice()
  ])
  
  // Auto-select first group if available
  if (groupsStore.groups.length > 0) {
    selectGroup(groupsStore.groups[0])
  }
})
</script>