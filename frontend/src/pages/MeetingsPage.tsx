import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Calendar, Plus, Trash2, Edit2, Eye, X, Check, Clock, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getFacultyGroups,
  getGroupMembers,
  createFacultyGroup,
  updateFacultyGroup,
  deleteFacultyGroup,
  addGroupMember,
  removeGroupMember,
  getFacultyUsers,
  getMeetingStats
} from '../lib/supabase/groups'
import {
  getAllMeetings,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getMeetingGroups,
  getMeetingResponses,
  submitMeetingResponse
} from '../lib/supabase/meetings'
import { useAuth } from '../context/AuthContext'
import type { FacultyGroup, Meeting, MeetingResponse, FacultyGroupMember } from '../types/meetings'

type TabType = 'groups' | 'create' | 'history'

function MeetingGroupsTab() {
  const [groups, setGroups] = useState<FacultyGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<FacultyGroup | null>(null)
  const [members, setMembers] = useState<FacultyGroupMember[]>([])
  const [facultyUsers, setFacultyUsers] = useState<any[]>([])
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadGroups()
    loadFacultyUsers()
  }, [])

  const loadGroups = async () => {
    setLoading(true)
    try {
      const data = await getFacultyGroups()
      setGroups(data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load faculty groups')
    } finally {
      setLoading(false)
    }
  }

  const loadFacultyUsers = async () => {
    try {
      const data = await getFacultyUsers()
      setFacultyUsers(data)
    } catch (error) {
      console.error(error)
    }
  }

  const loadMembers = async (groupId: string) => {
    try {
      const data = await getGroupMembers(groupId)
      setMembers(data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load group members')
    }
  }

  const handleCreateGroup = async () => {
    if (!formData.name.trim()) {
      toast.error('Group name is required')
      return
    }

    try {
      if (editingId) {
        await updateFacultyGroup(editingId, formData)
        toast.success('Group updated successfully')
      } else {
        await createFacultyGroup(formData)
        toast.success('Group created successfully')
      }
      setFormData({ name: '', description: '' })
      setEditingId(null)
      setShowCreateModal(false)
      loadGroups()
    } catch (error) {
      console.error(error)
      toast.error('Failed to save group')
    }
  }

  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return

    try {
      await deleteFacultyGroup(groupId)
      toast.success('Group deleted successfully')
      loadGroups()
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete group')
    }
  }

  const handleViewMembers = async (group: FacultyGroup) => {
    setSelectedGroup(group)
    await loadMembers(group.id)
    setShowMembersModal(true)
  }

  const handleEditGroup = (group: FacultyGroup) => {
    setFormData({ name: group.name, description: group.description || '' })
    setEditingId(group.id)
    setShowCreateModal(true)
  }

  const handleAddMember = async (userId: string) => {
    if (!selectedGroup) return

    try {
      await addGroupMember(selectedGroup.id, userId)
      toast.success('Member added successfully')
      await loadMembers(selectedGroup.id)
    } catch (error) {
      console.error(error)
      toast.error('Failed to add member')
    }
  }

  const handleRemoveMember = async (groupId: string, userId: string) => {
    if (!window.confirm('Remove this member from the group?')) return

    try {
      await removeGroupMember(groupId, userId)
      toast.success('Member removed successfully')
      if (selectedGroup) await loadMembers(selectedGroup.id)
    } catch (error) {
      console.error(error)
      toast.error('Failed to remove member')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Faculty Groups</h2>
          <p className="text-sm text-zinc-400 mt-1">Manage faculty groups for meeting assignments</p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: '', description: '' })
            setEditingId(null)
            setShowCreateModal(true)
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 transition-all"
        >
          <Plus size={18} /> Create Group
        </button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-zinc-500">
              <th className="px-6 py-4">Group Name</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Members</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                  Loading groups...
                </td>
              </tr>
            ) : groups.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                  No faculty groups found. Create one to get started.
                </td>
              </tr>
            ) : (
              groups.map((group) => (
                <tr key={group.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{group.name}</td>
                  <td className="px-6 py-4 text-zinc-400">{group.description || '—'}</td>
                  <td className="px-6 py-4 text-white">{group.member_count || 0}</td>
                  <td className="px-6 py-4 text-zinc-400">{new Date(group.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleViewMembers(group)}
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEditGroup(group)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{editingId ? 'Edit Group' : 'Create New Group'}</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Group Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., English Department"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description..."
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  className="flex-1 px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 transition-colors font-semibold"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showMembersModal && selectedGroup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedGroup.name}</h3>
                <p className="text-sm text-zinc-400 mt-1">{members.length} members</p>
              </div>
              <button onClick={() => setShowMembersModal(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Add Faculty Member</label>
                <div className="flex gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddMember(e.target.value)
                        e.target.value = ''
                      }
                    }}
                    className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    <option value="">Select a faculty member...</option>
                    {facultyUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-sm text-zinc-400 mb-3">Current Members</p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {members.length === 0 ? (
                    <p className="text-zinc-500 text-sm py-4">No members in this group</p>
                  ) : (
                    members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{member.user?.name}</p>
                          <p className="text-xs text-zinc-400">{member.user?.email}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveMember(selectedGroup.id, member.user_id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowMembersModal(false)}
                className="w-full px-4 py-2 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 transition-colors mt-4"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function CreateMeetingTab() {
  const [groups, setGroups] = useState<FacultyGroup[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meeting_date: '',
    start_time: '',
    end_time: '',
    venue: '',
    meeting_link: '',
    priority: 'normal' as const,
    status: 'scheduled' as const
  })

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    try {
      const data = await getFacultyGroups()
      setGroups(data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load groups')
    }
  }

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.meeting_date || !formData.start_time || selectedGroups.length === 0) {
      toast.error('Please fill all required fields and select at least one group')
      return
    }

    setLoading(true)
    try {
      await createMeeting({
        ...formData,
        assigned_group_ids: selectedGroups
      })
      toast.success('Meeting created successfully')
      setFormData({
        title: '',
        description: '',
        meeting_date: '',
        start_time: '',
        end_time: '',
        venue: '',
        meeting_link: '',
        priority: 'normal',
        status: 'scheduled'
      })
      setSelectedGroups([])
    } catch (error) {
      console.error(error)
      toast.error('Failed to create meeting')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Create Meeting</h2>
        <p className="text-sm text-zinc-400 mt-1">Schedule a new faculty meeting and assign to groups</p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Meeting title..."
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Meeting Date *</label>
            <input
              type="date"
              value={formData.meeting_date}
              onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Start Time *</label>
            <input
              type="time"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">End Time</label>
            <input
              type="time"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Meeting details..."
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Venue</label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="Location or Room Number"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Meeting Link</label>
            <input
              type="url"
              value={formData.meeting_link}
              onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-3">Assign to Faculty Groups *</label>
          <div className="space-y-2 max-h-[250px] overflow-y-auto border border-white/10 rounded-xl p-4 bg-black/20">
            {groups.length === 0 ? (
              <p className="text-zinc-500 text-sm">No faculty groups available</p>
            ) : (
              groups.map((group) => (
                <label key={group.id} className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedGroups.includes(group.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedGroups([...selectedGroups, group.id])
                      } else {
                        setSelectedGroups(selectedGroups.filter((id) => id !== group.id))
                      }
                    }}
                    className="w-4 h-4 rounded accent-purple-600"
                  />
                  <div>
                    <p className="text-white font-medium">{group.name}</p>
                    <p className="text-xs text-zinc-500">{group.description}</p>
                  </div>
                </label>
              ))
            )}
          </div>
          {selectedGroups.length > 0 && (
            <p className="text-xs text-purple-400 mt-2">
              {selectedGroups.length} group{selectedGroups.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Meeting'}
        </button>
      </div>
    </div>
  )
}

function MeetingHistoryTab() {
  const { user } = useAuth()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [meetingDetails, setMeetingDetails] = useState<any>(null)
  const [assignedGroups, setAssignedGroups] = useState<any[]>([])
  const [responses, setResponses] = useState<any>(null)

  useEffect(() => {
    loadMeetings()
  }, [])

  const loadMeetings = async () => {
    setLoading(true)
    try {
      const data = await getAllMeetings()
      setMeetings(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
    } catch (error) {
      console.error(error)
      toast.error('Failed to load meetings')
    } finally {
      setLoading(false)
    }
  }

  const handleViewMeeting = async (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    try {
      const [details, groups, resps] = await Promise.all([
        getMeetingById(meeting.id),
        getMeetingGroups(meeting.id),
        getMeetingResponses(meeting.id)
      ])
      setMeetingDetails(details)
      setAssignedGroups(groups)
      setResponses(resps)
      setShowDetailsModal(true)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load meeting details')
    }
  }

  const handleDeleteMeeting = async (meetingId: string) => {
    if (!window.confirm('Are you sure you want to delete this meeting?')) return

    try {
      await deleteMeeting(meetingId)
      toast.success('Meeting deleted successfully')
      loadMeetings()
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete meeting')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400'
      case 'normal':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'low':
        return 'bg-blue-500/20 text-blue-400'
      default:
        return 'bg-zinc-500/20 text-zinc-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400'
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-zinc-500/20 text-zinc-400'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Meeting History</h2>
        <p className="text-sm text-zinc-400 mt-1">View all faculty meetings and their details</p>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-zinc-500">
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Venue</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Responses</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-zinc-500">
                  Loading meetings...
                </td>
              </tr>
            ) : meetings.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-zinc-500">
                  No meetings scheduled yet
                </td>
              </tr>
            ) : (
              meetings.map((meeting) => (
                <tr key={meeting.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{meeting.title}</td>
                  <td className="px-6 py-4 text-zinc-400">{new Date(meeting.meeting_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-zinc-400">{meeting.start_time}</td>
                  <td className="px-6 py-4 text-zinc-400">{meeting.venue || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(meeting.priority)}`}>
                      {meeting.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(meeting.status)}`}>
                      {meeting.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white">{meeting.responses_count || 0}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleViewMeeting(meeting)}
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteMeeting(meeting.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showDetailsModal && selectedMeeting && meetingDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedMeeting.title}</h3>
                <span className={`inline-block text-xs px-2 py-1 rounded-full mt-2 ${getStatusColor(selectedMeeting.status)}`}>
                  {selectedMeeting.status}
                </span>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm text-zinc-500 uppercase tracking-wider mb-3">Meeting Information</h4>
                <div className="grid grid-cols-2 gap-4 p-4 bg-black/40 rounded-lg">
                  <div>
                    <p className="text-xs text-zinc-500">Date</p>
                    <p className="text-white font-medium">{new Date(selectedMeeting.meeting_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Time</p>
                    <p className="text-white font-medium">
                      {selectedMeeting.start_time} - {selectedMeeting.end_time || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Venue</p>
                    <p className="text-white font-medium">{selectedMeeting.venue || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Priority</p>
                    <p className="text-white font-medium capitalize">{selectedMeeting.priority}</p>
                  </div>
                </div>
                {selectedMeeting.description && (
                  <div className="mt-4">
                    <p className="text-xs text-zinc-500 mb-2">Description</p>
                    <p className="text-white text-sm">{selectedMeeting.description}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm text-zinc-500 uppercase tracking-wider mb-3">Assigned Groups</h4>
                <div className="flex flex-wrap gap-2">
                  {assignedGroups.map((group) => (
                    <span key={group.id || group.group_id} className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">
                      {group.name || group.group?.name}
                    </span>
                  ))}
                </div>
              </div>

              {responses && (
                <div>
                  <h4 className="text-sm text-zinc-500 uppercase tracking-wider mb-3">Response Summary</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      <p className="text-xs text-emerald-400">Attending</p>
                      <p className="text-2xl font-bold text-emerald-400">{responses.stats?.attending || 0}</p>
                    </div>
                    <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <p className="text-xs text-yellow-400">Maybe</p>
                      <p className="text-2xl font-bold text-yellow-400">{responses.stats?.maybe || 0}</p>
                    </div>
                    <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <p className="text-xs text-red-400">Not Attending</p>
                      <p className="text-2xl font-bold text-red-400">{responses.stats?.not_attending || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full px-4 py-2 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default function MeetingsPage() {
  const [tab, setTab] = useState<TabType>('groups')
  const [stats, setStats] = useState({
    total_meetings: 0,
    upcoming_meetings: 0,
    completed_meetings: 0,
    total_faculty_groups: 0
  })
  const [loadingStats, setLoadingStats] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoadingStats(true)
    setError(null)
    try {
      const data = await getMeetingStats()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
      setError('Failed to load meeting statistics. The server may not be running or the database tables may not exist.')
      toast.error('Failed to load meeting data')
    } finally {
      setLoadingStats(false)
    }
  }

  const statCards = [
    { label: 'Total Meetings', value: stats.total_meetings, icon: Calendar, color: 'text-purple-400' },
    { label: 'Upcoming Meetings', value: stats.upcoming_meetings, icon: Clock, color: 'text-blue-400' },
    { label: 'Completed Meetings', value: stats.completed_meetings, icon: Check, color: 'text-emerald-400' },
    { label: 'Faculty Groups', value: stats.total_faculty_groups, icon: Users, color: 'text-cyan-400' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Meetings</h1>
        <p className="text-zinc-400">Manage faculty meetings, groups, schedules and attendance responses.</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border border-red-500/30 bg-red-500/10 rounded-2xl p-4 flex items-start gap-3"
        >
          <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-1" />
          <div>
            <p className="text-red-400 font-semibold">Connection Error</p>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon size={20} className={stat.color} />
              <span className="text-xs bg-zinc-800 px-2 py-1 rounded-full text-zinc-300">{stat.label}</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-zinc-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex border-b border-white/10">
          {[
            { id: 'groups', label: 'Meeting Groups' },
            { id: 'create', label: 'Create Meeting' },
            { id: 'history', label: 'Meeting History' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as TabType)}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                tab === t.id
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'groups' && <MeetingGroupsTab />}
          {tab === 'create' && <CreateMeetingTab />}
          {tab === 'history' && <MeetingHistoryTab />}
        </div>
      </div>
    </div>
  )
}
