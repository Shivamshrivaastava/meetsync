import React from 'react';
import { Calendar, Clock, Tag, Users, ChevronRight } from 'lucide-react';

const MeetingCard = ({ meeting, onClick, onViewDetails }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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

  return (
    <div className="bg-white backdrop-blur-lg border border-gray-200 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden" onClick={() => onViewDetails(meeting._id)}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">{meeting.title}</h3>
          <div className="flex items-center text-sm text-gray-500 gap-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-gray-400" />
              {formatDate(meeting.date)}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-gray-400" />
              {new Date(meeting.date).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 transition-colors" />
      </div>

      <div className="mb-4 text-gray-700 leading-relaxed line-clamp-3">{meeting.summary}</div>

      {meeting.keyPoints && meeting.keyPoints.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Key Points:</h4>
          <ul className="text-sm text-gray-600 list-none">
            {meeting.keyPoints.slice(0, 2).map((point, index) => (
              <li key={index} className="flex items-start mb-1">
                <span className="text-blue-600 mr-2">•</span>
                <span className="line-clamp-2">{point}</span>
              </li>
            ))}
            {meeting.keyPoints.length > 2 && (
              <li className="text-gray-400 italic">
                +{meeting.keyPoints.length - 2} more points
              </li>
            )}
          </ul>
        </div>
      )}

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

      <div className="grid grid-cols-3 gap-4 text-sm text-center">
        {meeting.deadlines && meeting.deadlines.length > 0 && (
          <div className="text-center">
            <div className="font-semibold mb-1 text-red-600">{meeting.deadlines.length}</div>
            <div className="text-gray-600">Deadlines</div>
          </div>
        )}
        {meeting.opportunities && meeting.opportunities.length > 0 && (
          <div className="text-center">
            <div className="font-semibold mb-1 text-green-600">{meeting.opportunities.length}</div>
            <div className="text-gray-600">Opportunities</div>
          </div>
        )}
        {meeting.actionItems && meeting.actionItems.length > 0 && (
          <div className="text-center">
            <div className="font-semibold mb-1 text-blue-600">{meeting.actionItems.length}</div>
            <div className="text-gray-600">Action Items</div>
          </div>
        )}
      </div>

      {meeting.opportunities && meeting.opportunities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Top Opportunity:</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(meeting.opportunities[0].priority)}`}>
              {meeting.opportunities[0].title}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingCard;
