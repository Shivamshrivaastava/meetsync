import React, { useState, useEffect } from 'react';
import { Plus, Brain, Search, Filter, Calendar as CalendarIcon } from 'lucide-react';
import MeetingCard from './components/MeetingCard';
import MeetingDetail from './components/MeetingDetail';
import NewMeetingForm from './components/NewMeetingForm';
import { meetingsAPI, healthAPI } from './services/api';

function App() {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showNewMeetingForm, setShowNewMeetingForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    fetchMeetings();
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      await healthAPI.check();
      setApiStatus('connected');
    } catch (error) {
      setApiStatus('disconnected');
      console.error('API health check failed:', error);
    }
  };

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await meetingsAPI.getAll();
      setMeetings(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      setError('Failed to load meetings. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async (meetingData) => {
    try {
      const response = await meetingsAPI.create(meetingData);
      setMeetings(prev => [response.data, ...prev]);
      setShowNewMeetingForm(false);
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  };

  const handleReprocessMeeting = async (meetingId) => {
    try {
      const response = await meetingsAPI.reprocess(meetingId);
      setMeetings(prev => 
        prev.map(meeting => 
          meeting._id === meetingId ? response.data : meeting
        )
      );
      if (selectedMeeting && selectedMeeting._id === meetingId) {
        setSelectedMeeting(response.data);
      }
    } catch (error) {
      console.error('Error reprocessing meeting:', error);
      throw error;
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    try {
      await meetingsAPI.delete(meetingId);
      setMeetings(prev => prev.filter(meeting => meeting._id !== meetingId));
      if (selectedMeeting && selectedMeeting._id === meetingId) {
        setSelectedMeeting(null);
      }
    } catch (error) {
      console.error('Error deleting meeting:', error);
      throw error;
    }
  };

  const handleViewDetails = async (meetingId) => {
    try {
      const response = await meetingsAPI.getById(meetingId);
      setSelectedMeeting(response.data);
    } catch (error) {
      console.error('Error fetching meeting details:', error);
    }
  };

  const getAllTags = () => {
    const tags = new Set();
    meetings.forEach(meeting => {
      if (meeting.tags) {
        meeting.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterTag === 'all' || (meeting.tags && meeting.tags.includes(filterTag));
    return matchesSearch && matchesFilter;
  });

  if (selectedMeeting) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MeetingDetail
          meeting={selectedMeeting}
          onBack={() => setSelectedMeeting(null)}
          onReprocess={handleReprocessMeeting}
          onDelete={handleDeleteMeeting}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 to-indigo-50/5 pointer-events-none"></div>
      {/* Header */}
      <header className="bg-white/98 backdrop-blur-sm border-b border-slate-200 relative z-10 shadow-xs sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">MeetSync</h1>
                <p className="text-xs text-slate-500">AI Meeting Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 ${
                apiStatus === 'connected'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  apiStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}></div>
                {apiStatus === 'connected' ? 'Connected' : 'Offline'}
              </div>
              <button
                onClick={() => setShowNewMeetingForm(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200 hover:shadow-md active:shadow-xs active:bg-blue-800"
              >
                <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
                New Meeting
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search meetings by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400 shadow-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white cursor-pointer transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
              >
                <option value="all">All Tags</option>
                {getAllTags().map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 shadow-xs">
            <p className="text-red-700 font-medium text-sm">{error}</p>
            <button
              onClick={fetchMeetings}
              className="mt-2 text-red-600 text-sm font-medium hover:text-red-700 transition-colors cursor-pointer"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredMeetings.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {searchTerm || filterTag !== 'all' ? 'No meetings found' : 'No meetings yet'}
            </h3>
            <p className="text-slate-600 mb-8 leading-relaxed max-w-sm mx-auto">
              {searchTerm || filterTag !== 'all'
                ? 'Try adjusting your search or filters to find what you need'
                : 'Create your first meeting to unlock AI-powered insights and analysis'
              }
            </p>
            {!searchTerm && filterTag === 'all' && (
              <button
                onClick={() => setShowNewMeetingForm(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200 hover:shadow-md active:shadow-xs active:bg-blue-800"
              >
                <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
                Create Your First Meeting
              </button>
            )}
          </div>
        )}

        {/* Meetings Grid */}
        {!loading && !error && filteredMeetings.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-max">
            {filteredMeetings.map(meeting => (
              <MeetingCard
                key={meeting._id}
                meeting={meeting}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </main>

      {/* New Meeting Form Modal */}
      {showNewMeetingForm && (
        <NewMeetingForm
          onSubmit={handleCreateMeeting}
          onCancel={() => setShowNewMeetingForm(false)}
        />
      )}
    </div>
  );
}

export default App;
