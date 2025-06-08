import type { Settlement } from '@prisma/client'
import { defineStore } from 'pinia'

interface Group {
  id: string
  name: string
  description?: string
  created_by: string
  created_at: string
  members?: GroupMember[]
}

interface GroupMember {
  id: string
  group_id: string
  user_id: string
  joined_at: string
  user: {
    id: string
    email: string
    lightning_address?: string
  }
}

export const useGroupsStore = defineStore('groups', () => {
  const api = useApi()
  const groups = ref<Group[]>([])
  const currentGroup = ref<Group | null>(null)
  const loading = ref(false)

  const fetchGroups = async () => {
    loading.value = true
    try {
      const response = await api.get<{ groups: (Group & {Settlement: Settlement[]})[] }>('/api/groups')
      groups.value = response.groups
    } finally {
      loading.value = false
    }
  }

  const createGroup = async (name: string, description?: string) => {
    const response = await api.post<{ group: Group }>('/api/groups', {
      name,
      description
    })
    
    await fetchGroups()
    return response.group
  }

  const fetchGroupMembers = async (groupId: string) => {
    const response = await api.get<{ members: GroupMember[] }>(`/api/groups/${groupId}/members`)
    return response.members
  }

  const setCurrentGroup = (group: Group) => {
    currentGroup.value = group
  }

  return {
    groups: readonly(groups),
    currentGroup: readonly(currentGroup),
    loading: readonly(loading),
    fetchGroups,
    createGroup,
    fetchGroupMembers,
    setCurrentGroup
  }
})