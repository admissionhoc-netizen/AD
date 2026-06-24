export interface FacultyGroup {
  id: string
  name: string
  description: string | null
  created_at: string
  created_by: string
  member_count?: number
}

export interface FacultyGroupMember {
  id: string
  group_id: string
  user_id: string
  user?: {
    id: string
    name: string
    email: string
    department?: string
    role: string
  }
}

export interface Meeting {
  id: string
  title: string
  description: string | null
  meeting_date: string
  start_time: string
  end_time: string
  venue: string
  meeting_link: string | null
  priority: 'low' | 'normal' | 'high'
  status: 'scheduled' | 'completed' | 'cancelled'
  created_by: string
  created_at: string
  assigned_groups?: string[] | FacultyGroup[]
  responses_count?: number
}

export interface MeetingGroup {
  id: string
  meeting_id: string
  group_id: string
  group?: FacultyGroup
}

export interface MeetingResponse {
  id: string
  meeting_id: string
  user_id: string
  response: 'attending' | 'maybe' | 'not_attending'
  responded_at: string
}

export interface CreateMeetingInput {
  title: string
  description: string
  meeting_date: string
  start_time: string
  end_time: string
  venue: string
  meeting_link?: string
  priority: 'low' | 'normal' | 'high'
  status: 'scheduled' | 'completed' | 'cancelled'
  assigned_group_ids: string[]
}

export interface CreateGroupInput {
  name: string
  description: string
}

export interface UpdateGroupInput {
  name: string
  description: string
}

export interface MeetingStats {
  total_meetings: number
  upcoming_meetings: number
  completed_meetings: number
  total_faculty_groups: number
}
