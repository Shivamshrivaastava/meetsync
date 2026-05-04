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
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTagColor = (tag) => {
    const colors = {
      frontend: 'bg-blue-100 text-blue-800',
      backend: 'bg-purple-100 text-purple-800',
      hiring: 'bg-emerald-100 text-emerald-800',
      strategy: 'bg-orange-100 text-orange-800',
      technical: 'bg-indigo-100 text-indigo-800',
      business: 'bg-pink-100 text-pink-800',
      other: 'bg-slate-100 text-slate-800',
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center text-slate-600 hover:text-slate-900 transition-colors font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Meetings
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleReprocess}
                disabled={isReprocessing}
                className="inline-flex items-center px-3 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed border border-blue-200 shadow-xs"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isReprocessing ? 'animate-spin' : ''}`} />
                {isReprocessing ? 'Processing...' : 'Reprocess'}
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200 border border-red-200 shadow-xs"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">{meeting.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <div className="flex items-center text-slate-600 text-sm">
                <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                {formatDate(meeting.date)}
              </div>
              <div className="flex items-center text-slate-600 text-sm">
                <Clock className="w-4 h-4 mr-2 text-slate-400" />
                {formatTime(meeting.date)}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {meeting.tags && meeting.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md ${getTagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6 shadow-xs">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Summary</h2>
          <p className="text-slate-700 leading-relaxed text-sm">{meeting.summary}</p>
        </div>

        {/* What You Missed */}
        <div className="bg-amber-50 rounded-lg p-6 mb-6 border border-amber-200 shadow-xs">
          <h2 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            What You Missed
          </h2>
          <p className="text-amber-800 leading-relaxed text-sm">{meeting.whatYouMissed}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Points */}
          {meeting.keyPoints && meeting.keyPoints.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Key Points</h2>
              <ul className="space-y-3">
                {meeting.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Deadlines */}
          {meeting.deadlines && meeting.deadlines.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Deadlines</h2>
              <div className="space-y-3">
                {meeting.deadlines.map((deadline, index) => (
                  <div key={index} className="border-l-4 border-red-500 pl-4">
                    <h3 className="font-medium text-slate-900 text-sm">{deadline.title}</h3>
                    <p className="text-slate-600 text-xs mt-1">{deadline.description}</p>
                    <p className="text-red-600 text-xs font-medium mt-2">
                      Due: {new Date(deadline.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Opportunities */}
          {meeting.opportunities && meeting.opportunities.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0" />
                Opportunities
              </h2>
              <div className="space-y-3">
                {meeting.opportunities.map((opportunity, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-slate-900 text-sm">{opportunity.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getPriorityColor(opportunity.priority)}`}>
                        {opportunity.priority}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs">{opportunity.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Items */}
          {meeting.actionItems && meeting.actionItems.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Action Items</h2>
              <div className="space-y-3">
                {meeting.actionItems.map((item, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-medium text-slate-900 text-sm">{item.task}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-slate-600 text-xs">Assigned to: {item.assignedTo}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                        item.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                    {item.dueDate && (
                      <p className="text-slate-500 text-xs mt-2">
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
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Decisions Made</h2>
              <div className="space-y-3">
                {meeting.decisions.map((decision, index) => (
                  <div key={index} className="border-l-4 border-indigo-500 pl-4">
                    <h3 className="font-medium text-slate-900 text-sm">{decision.title}</h3>
                    <p className="text-slate-600 text-xs mt-1">{decision.description}</p>
                    <p className="text-indigo-600 text-xs font-medium mt-2">
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
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs mt-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Full Transcript</h2>
            <div className="bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto border border-slate-200">
              <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">{meeting.transcript}</pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MeetingDetail;
