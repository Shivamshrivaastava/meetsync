import React, { useState } from 'react';
import { Plus, X, FileText, Calendar } from 'lucide-react';

const NewMeetingForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    transcript: '',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Meeting title is required';
    }
    
    if (!formData.transcript.trim()) {
      newErrors.transcript = 'Meeting transcript is required';
    } else if (formData.transcript.length < 50) {
      newErrors.transcript = 'Transcript must be at least 50 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        date: new Date(formData.date).toISOString()
      });
    } catch (error) {
      console.error('Error submitting meeting:', error);
      setErrors({ submit: 'Failed to create meeting. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sampleTranscript = `John: Good morning everyone. Let's start today's standup meeting.
Sarah: Hi John. I worked on the user authentication module yesterday and completed the login functionality.
Mike: I integrated the frontend with the new API endpoints and fixed several bugs in the dashboard.
John: Great progress. Sarah, can you complete the password reset feature by Friday? We need it for the client demo.
Sarah: Yes, I'll prioritize that and have it ready by Thursday.
Mike: I'll be working on improving the performance of the data loading this week.
John: Perfect. Also, we have a new opportunity to present our project at the tech conference next month. Sarah, can you prepare a demo?
Sarah: Absolutely! I'd love to present our work.
John: Meeting adjourned. See you all tomorrow.`;

  const loadSampleTranscript = () => {
    setFormData(prev => ({
      ...prev,
      transcript: sampleTranscript
    }));
    setErrors(prev => ({
      ...prev,
      transcript: ''
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white/98 backdrop-blur-lg rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto border border-white/20">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Create New Meeting</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 shadow-sm">
              <p className="text-red-600 font-medium">{errors.submit}</p>
            </div>
          )}

          <div className="flex flex-col">
            <label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2">
              Meeting Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`px-4 py-2 border rounded-lg text-sm transition-all duration-200 outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Daily Standup - Development Team"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="date" className="text-sm font-medium text-gray-700 mb-2">
              Meeting Date *
            </label>
            <div className="relative">
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-2 pr-10 border rounded-lg text-sm transition-all duration-200 outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="transcript" className="text-sm font-medium text-gray-700 mb-2">
                Meeting Transcript *
              </label>
              <button
                type="button"
                onClick={loadSampleTranscript}
                className="text-blue-600 text-sm hover:text-blue-700 transition-colors cursor-pointer"
              >
                Load Sample Transcript
              </button>
            </div>
            <div className="relative">
              <textarea
                id="transcript"
                name="transcript"
                value={formData.transcript}
                onChange={handleChange}
                rows={12}
                className={`w-full px-4 py-2 pr-10 border rounded-lg text-sm font-mono resize-y transition-all duration-200 outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 ${
                  errors.transcript ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Paste or type the meeting transcript here. Include speaker names and dialogue..."
              />
              <FileText className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.transcript && (
              <p className="text-red-500 text-sm mt-1">{errors.transcript}</p>
            )}
            <p className="text-gray-600 text-sm mt-1">
              Minimum 50 characters. Include speaker names for better AI analysis.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">AI Processing Notice</h3>
            <p className="text-blue-800 text-sm">
              Your transcript will be processed using Groq AI to extract key insights, deadlines, 
              opportunities, and action items. This process typically takes 10-30 seconds.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-blue-600 rounded-lg shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 active:translate-y-0 active:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
                  Create Meeting
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMeetingForm;
