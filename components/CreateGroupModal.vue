<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="card max-w-md w-full">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold">Create New Group</h3>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <X class="w-6 h-6" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="groupName" class="block text-sm font-medium mb-2">Group Name</label>
          <input
            id="groupName"
            v-model="groupName"
            type="text"
            required
            class="input-field"
            placeholder="Enter group name"
          />
        </div>
        
        <div>
          <label for="description" class="block text-sm font-medium mb-2">Description (Optional)</label>
          <textarea
            id="description"
            v-model="description"
            class="input-field"
            rows="3"
            placeholder="Enter group description"
          ></textarea>
        </div>

        <div class="flex gap-3">
          <button type="button" @click="$emit('close')" class="btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" :disabled="loading" class="btn-primary flex-1">
            <span v-if="loading">Creating...</span>
            <span v-else>Create Group</span>
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

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  created: []
}>()

const groupsStore = useGroupsStore()

const groupName = ref('')
const description = ref('')
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await groupsStore.createGroup(groupName.value, description.value)
    groupName.value = ''
    description.value = ''
    emit('created')
    emit('close')
  } catch (err: any) {
    error.value = err.message || 'Failed to create group'
  } finally {
    loading.value = false
  }
}
</script>