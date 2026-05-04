import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Tag, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  TrendingUp,
  ArrowLeft,
  RefreshCw,
  Trash2
} from 'lucide-react';

const MeetingDetail = ({ meeting, onBack, onReprocess, onDelete }) => {
  const [isReprocessing, setIsReprocessing] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTagColor = (tag) => {
    const colors = {
      frontend: 'bg-blue-100 text-blue-800',
      backend: 'bg-purple-100 text-purple-800',
      hiring: 'bg-green-100 text-green-800',
      strategy: 'bg-orange-100 text-orange-800',
      technical: 'bg-indigo-100 text-indigo-800',
      business: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[tag] || colors.other;
  };

  const handleReprocess = async () => {
    setIsReprocessing(true);
    try {
      await onReprocess(meeting._id);
    } finally {
      setIsReprocessing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      await onDelete(meeting._id);
    }
  };

  if (!meeting) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Meetings
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleReprocess}
              disabled={isReprocessing}
              className="btn btn-primary"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isReprocessing ? 'animate-spin' : ''}`} />
              {isReprocessing ? 'Processing...' : 'Reprocess'}
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-danger"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{meeting.title}</h1>
        
        <div className="flex items-center text-gray-600 space-x-6 mb-4">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            {formatDate(meeting.date)}
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            {formatTime(meeting.date)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {meeting.tags && meeting.tags.map((tag, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs font-medium rounded-full ${getTagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white backdrop-blur-lg border border-gray-200 rounded-xl p-6 mb-6 shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary</h2>
        <p className="text-gray-700 leading-relaxed">{meeting.summary}</p>
      </div>

      {/* What You Missed */}
      <div className="bg-yellow-50 rounded-lg shadow-md p-6 mb-6 border border-yellow-200">
        <h2 className="text-xl font-semibold text-yellow-900 mb-4 flex items-center">
          <AlertCircle className="w-6 h-6 mr-2" />
          What You Missed
        </h2>
        <p className="text-yellow-800 leading-relaxed">{meeting.whatYouMissed}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Points */}
        {meeting.keyPoints && meeting.keyPoints.length > 0 && (
          <div className="bg-white backdrop-blur-lg border border-gray-200 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Points</h2>
            <ul className="space-y-3">
              {meeting.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Deadlines */}
        {meeting.deadlines && meeting.deadlines.length > 0 && (
          <div className="bg-white backdrop-blur-lg border border-gray-200 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Deadlines</h2>
            <div className="space-y-3">
              {meeting.deadlines.map((deadline, index) => (
                <div key={index} className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-medium text-gray-900">{deadline.title}</h3>
                  <p className="text-gray-600 text-sm">{deadline.description}</p>
                  <p className="text-red-600 text-sm font-medium">
                    Due: {new Date(deadline.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Opportunities */}
        {meeting.opportunities && meeting.opportunities.length > 0 && (
          <div className="bg-white backdrop-blur-lg border border-gray-200 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2" />
              Opportunities
            </h2>
            <div className="space-y-3">
              {meeting.opportunities.map((opportunity, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{opportunity.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(opportunity.priority)}`}>
                      {opportunity.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{opportunity.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Items */}
        {meeting.actionItems && meeting.actionItems.length > 0 && (
          <div className="bg-white backdrop-blur-lg border border-gray-200 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Action Items</h2>
            <div className="space-y-3">
              {meeting.actionItems.map((item, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-900">{item.task}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-gray-600 text-sm">Assigned to: {item.assignedTo}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      item.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  {item.dueDate && (
                    <p className="text-gray-500 text-sm">
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decisions */}
        {meeting.decisions && meeting.decisions.length > 0 && (
          <div className="bg-white backdrop-blur-lg border border-gray-200 rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Decisions Made</h2>
            <div className="space-y-3">
              {meeting.decisions.map((decision, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-medium text-gray-900">{decision.title}</h3>
                  <p className="text-gray-600 text-sm">{decision.description}</p>
                  <p className="text-purple-600 text-sm font-medium">
                    Made by: {decision.madeBy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Transcript */}
      {meeting.transcript && (
        <div className="bg-white backdrop-blur-lg border border-gray-200 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Full Transcript</h2>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">{meeting.transcript}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingDetail;
