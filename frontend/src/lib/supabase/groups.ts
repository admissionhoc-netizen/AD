import { apiFetch } from '../../hooks/useApi'
import type { FacultyGroup, FacultyGroupMember, CreateGroupInput, UpdateGroupInput, MeetingStats } from '../../types/meetings'

// Get all faculty groups
export async function getFacultyGroups(): Promise<FacultyGroup[]> {
  try {
    const response = await apiFetch('/api/faculty-groups')
    return Array.isArray(response) ? response : response.data || []
  } catch (error) {
    console.error('Failed to fetch faculty groups:', error)
    throw error
  }
}

// Get faculty group with member count
export async function getFacultyGroupWithMembers(groupId: string): Promise<FacultyGroup & { members: FacultyGroupMember[] }> {
  try {
    const response = await apiFetch(`/api/faculty-groups/${groupId}`)
    return Array.isArray(response) ? response[0] : response.data
  } catch (error) {
    console.error('Failed to fetch faculty group:', error)
    throw error
  }
}

// Get members of a faculty group
export async function getGroupMembers(groupId: string): Promise<FacultyGroupMember[]> {
  try {
    const response = await apiFetch(`/api/faculty-groups/${groupId}/members`)
    return Array.isArray(response) ? response : response.data || []
  } catch (error) {
    console.error('Failed to fetch group members:', error)
    throw error
  }
}

// Create a new faculty group
export async function createFacultyGroup(data: CreateGroupInput): Promise<FacultyGroup> {
  try {
    const response = await apiFetch('/api/faculty-groups', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return Array.isArray(response) ? response[0] : response.data || response
  } catch (error) {
    console.error('Failed to create faculty group:', error)
    throw error
  }
}

// Update a faculty group
export async function updateFacultyGroup(groupId: string, data: UpdateGroupInput): Promise<FacultyGroup> {
  try {
    const response = await apiFetch(`/api/faculty-groups/${groupId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    return Array.isArray(response) ? response[0] : response.data || response
  } catch (error) {
    console.error('Failed to update faculty group:', error)
    throw error
  }
}

// Delete a faculty group
export async function deleteFacultyGroup(groupId: string): Promise<void> {
  try {
    await apiFetch(`/api/faculty-groups/${groupId}`, {
      method: 'DELETE'
    })
  } catch (error) {
    console.error('Failed to delete faculty group:', error)
    throw error
  }
}

// Add member to faculty group
export async function addGroupMember(groupId: string, userId: string): Promise<FacultyGroupMember> {
  try {
    const response = await apiFetch(`/api/faculty-groups/${groupId}/members`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId })
    })
    return Array.isArray(response) ? response[0] : response.data || response
  } catch (error) {
    console.error('Failed to add group member:', error)
    throw error
  }
}

// Remove member from faculty group
export async function removeGroupMember(groupId: string, userId: string): Promise<void> {
  try {
    await apiFetch(`/api/faculty-groups/${groupId}/members/${userId}`, {
      method: 'DELETE'
    })
  } catch (error) {
    console.error('Failed to remove group member:', error)
    throw error
  }
}

// Get all faculty users for selection
export async function getFacultyUsers(): Promise<any[]> {
  try {
    const response = await apiFetch('/api/users?role=faculty')
    return Array.isArray(response) ? response : response.data || []
  } catch (error) {
    console.error('Failed to fetch faculty users:', error)
    throw error
  }
}

// Get meeting statistics
export async function getMeetingStats(): Promise<MeetingStats> {
  try {
    const response = await apiFetch('/api/meetings/stats')
    return response && typeof response === 'object' ? response : {
      total_meetings: 0,
      upcoming_meetings: 0,
      completed_meetings: 0,
      total_faculty_groups: 0
    }
  } catch (error) {
    console.error('Failed to fetch meeting stats:', error)
    return {
      total_meetings: 0,
      upcoming_meetings: 0,
      completed_meetings: 0,
      total_faculty_groups: 0
    }
  }
}
