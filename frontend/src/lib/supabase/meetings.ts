import { apiFetch } from '../../hooks/useApi'
import type { Meeting, MeetingResponse, CreateMeetingInput } from '../../types/meetings'

// Get all meetings (admin view)
export async function getAllMeetings(): Promise<Meeting[]> {
  try {
    const response = await apiFetch('/api/meetings')
    return Array.isArray(response) ? response : response.data || []
  } catch (error) {
    console.error('Failed to fetch all meetings:', error)
    throw error
  }
}

// Get faculty user's meetings (only groups they belong to)
export async function getFacultyMeetings(userId: string): Promise<Meeting[]> {
  try {
    const response = await apiFetch(`/api/meetings/faculty/${userId}`)
    return Array.isArray(response) ? response : response.data || []
  } catch (error) {
    console.error('Failed to fetch faculty meetings:', error)
    throw error
  }
}

// Get meeting by ID with full details
export async function getMeetingById(meetingId: string): Promise<Meeting & { assigned_groups: any[], responses: MeetingResponse[] }> {
  try {
    const response = await apiFetch(`/api/meetings/${meetingId}`)
    return Array.isArray(response) ? response[0] : response.data || response
  } catch (error) {
    console.error('Failed to fetch meeting:', error)
    throw error
  }
}

// Create a new meeting
export async function createMeeting(data: CreateMeetingInput): Promise<Meeting> {
  try {
    const response = await apiFetch('/api/meetings', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return Array.isArray(response) ? response[0] : response.data || response
  } catch (error) {
    console.error('Failed to create meeting:', error)
    throw error
  }
}

// Update a meeting
export async function updateMeeting(meetingId: string, data: Partial<CreateMeetingInput>): Promise<Meeting> {
  try {
    const response = await apiFetch(`/api/meetings/${meetingId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    return Array.isArray(response) ? response[0] : response.data || response
  } catch (error) {
    console.error('Failed to update meeting:', error)
    throw error
  }
}

// Delete a meeting
export async function deleteMeeting(meetingId: string): Promise<void> {
  try {
    await apiFetch(`/api/meetings/${meetingId}`, {
      method: 'DELETE'
    })
  } catch (error) {
    console.error('Failed to delete meeting:', error)
    throw error
  }
}

// Submit a response to a meeting
export async function submitMeetingResponse(
  meetingId: string,
  userId: string,
  response: 'attending' | 'maybe' | 'not_attending'
): Promise<MeetingResponse> {
  try {
    const result = await apiFetch(`/api/meetings/${meetingId}/response`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, response })
    })
    return Array.isArray(result) ? result[0] : result.data || result
  } catch (error) {
    console.error('Failed to submit meeting response:', error)
    throw error
  }
}

// Get meeting responses with statistics
export async function getMeetingResponses(meetingId: string): Promise<{
  responses: MeetingResponse[]
  stats: { attending: number; maybe: number; not_attending: number }
}> {
  try {
    const response = await apiFetch(`/api/meetings/${meetingId}/responses`)
    return response && typeof response === 'object' ? response : { responses: [], stats: { attending: 0, maybe: 0, not_attending: 0 } }
  } catch (error) {
    console.error('Failed to fetch meeting responses:', error)
    throw error
  }
}

// Get groups assigned to a meeting
export async function getMeetingGroups(meetingId: string): Promise<any[]> {
  try {
    const response = await apiFetch(`/api/meetings/${meetingId}/groups`)
    return Array.isArray(response) ? response : response.data || []
  } catch (error) {
    console.error('Failed to fetch meeting groups:', error)
    throw error
  }
}
