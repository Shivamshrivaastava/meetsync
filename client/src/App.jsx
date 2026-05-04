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
    <div className="min-h-screen bg-gray-50 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/5 to-purple-50/5 pointer-events-none"></div>
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200 relative z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent -tracking-tighter">MeetSync</h1>
              <span className="ml-3 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 border border-blue-200">AI-Powered</span>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-full border transition-all duration-200 ${
                apiStatus === 'connected' 
                  ? 'bg-green-100 text-green-600 border-green-200' 
                  : 'bg-red-100 text-red-600 border-red-200'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  apiStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                {apiStatus === 'connected' ? 'Connected' : 'Disconnected'}
              </div>
              <button
                onClick={() => setShowNewMeetingForm(true)}
                className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-blue-600 rounded-lg shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 active:translate-y-0 active:shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
                New Meeting
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 mb-6 sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search meetings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm bg-white transition-all duration-200 outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer transition-all duration-200 outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 min-w-32"
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 shadow-sm">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={fetchMeetings}
              className="mt-2 text-red-600 text-sm underline hover:text-red-700 transition-colors cursor-pointer"
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
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || filterTag !== 'all' ? 'No meetings found' : 'No meetings yet'}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {searchTerm || filterTag !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first meeting to get started with AI-powered insights'
              }
            </p>
            {!searchTerm && filterTag === 'all' && (
              <button
                onClick={() => setShowNewMeetingForm(true)}
                className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-blue-600 rounded-lg shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 active:translate-y-0 active:shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
                Create Your First Meeting
              </button>
            )}
          </div>
        )}

        {/* Meetings Grid */}
        {!loading && !error && filteredMeetings.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
