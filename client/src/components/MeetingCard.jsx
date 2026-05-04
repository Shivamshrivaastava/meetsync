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
    <div className="bg-white border border-slate-200 rounded-lg p-5 cursor-pointer transition-all duration-300 hover:border-blue-300 hover:shadow-md hover:bg-slate-50 relative overflow-hidden shadow-xs group" onClick={() => onViewDetails(meeting._id)}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">{meeting.title}</h3>
          <div className="flex items-center text-xs text-slate-500 gap-3">
            <div className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {formatDate(meeting.date)}
            </div>
            <div className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {new Date(meeting.date).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 transition-all group-hover:text-blue-600 group-hover:translate-x-0.5" />
      </div>

      <div className="mb-3 text-slate-700 leading-relaxed line-clamp-2 text-sm">{meeting.summary}</div>

      {meeting.keyPoints && meeting.keyPoints.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-slate-900 mb-2 uppercase tracking-wide">Key Points:</h4>
          <ul className="text-xs text-slate-600 list-none space-y-1">
            {meeting.keyPoints.slice(0, 2).map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 flex-shrink-0">•</span>
                <span className="line-clamp-1">{point}</span>
              </li>
            ))}
            {meeting.keyPoints.length > 2 && (
              <li className="text-slate-400 text-xs">
                +{meeting.keyPoints.length - 2} more points
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        {meeting.tags && meeting.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className={`px-2 py-1 text-xs font-medium rounded-md ${getTagColor(tag)}`}
          >
            {tag}
          </span>
        ))}
        {meeting.tags && meeting.tags.length > 3 && (
          <span className="px-2 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-md">
            +{meeting.tags.length - 3}
          </span>
        )}
      </div>

      <div className="flex gap-3 text-xs">
        {meeting.deadlines && meeting.deadlines.length > 0 && (
          <div className="flex-1 bg-red-50 rounded-md p-2 text-center">
            <div className="font-semibold text-red-600">{meeting.deadlines.length}</div>
            <div className="text-red-600 text-xs">Deadlines</div>
          </div>
        )}
        {meeting.opportunities && meeting.opportunities.length > 0 && (
          <div className="flex-1 bg-green-50 rounded-md p-2 text-center">
            <div className="font-semibold text-green-600">{meeting.opportunities.length}</div>
            <div className="text-green-600 text-xs">Opportunities</div>
          </div>
        )}
        {meeting.actionItems && meeting.actionItems.length > 0 && (
          <div className="flex-1 bg-blue-50 rounded-md p-2 text-center">
            <div className="font-semibold text-blue-600">{meeting.actionItems.length}</div>
            <div className="text-blue-600 text-xs">Actions</div>
          </div>
        )}
      </div>

      {meeting.opportunities && meeting.opportunities.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <div className="flex items-start justify-between gap-2">
            <span className="text-xs font-semibold text-slate-700 text-left">Top Opp.:</span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-md text-right ${getPriorityColor(meeting.opportunities[0].priority)}`}>
              {meeting.opportunities[0].title.substring(0, 20)}...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingCard;
