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
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto border border-slate-200">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 z-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Create New Meeting</h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 shadow-xs">
              <p className="text-red-700 font-medium text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-semibold text-slate-900 mb-2">
              Meeting Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                errors.title ? 'border-red-500' : 'border-slate-200'
              }`}
              placeholder="e.g., Daily Standup - Development Team"
            />
            {errors.title && (
              <p className="text-red-600 text-xs mt-1.5">{errors.title}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="date" className="block text-sm font-semibold text-slate-900 mb-2">
              Meeting Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                  errors.date ? 'border-red-500' : 'border-slate-200'
                }`}
              />
              <Calendar className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            {errors.date && (
              <p className="text-red-600 text-xs mt-1.5">{errors.date}</p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="transcript" className="block text-sm font-semibold text-slate-900">
                Meeting Transcript
              </label>
              <button
                type="button"
                onClick={loadSampleTranscript}
                className="text-blue-600 text-xs hover:text-blue-700 transition-colors cursor-pointer font-medium"
              >
                Load Sample
              </button>
            </div>
            <div className="relative">
              <textarea
                id="transcript"
                name="transcript"
                value={formData.transcript}
                onChange={handleChange}
                rows={12}
                className={`w-full px-4 py-3 border rounded-lg text-sm font-mono resize-y transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                  errors.transcript ? 'border-red-500' : 'border-slate-200'
                }`}
                placeholder="Paste or type the meeting transcript here. Include speaker names and dialogue..."
              />
            </div>
            {errors.transcript && (
              <p className="text-red-600 text-xs mt-1.5">{errors.transcript}</p>
            )}
            <p className="text-slate-600 text-xs mt-2">
              Minimum 50 characters. Include speaker names for better AI analysis.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-1 text-sm">AI Processing Notice</h3>
            <p className="text-blue-800 text-xs leading-relaxed">
              Your transcript will be processed using Groq AI to extract key insights, deadlines, 
              opportunities, and action items. This process typically takes 10-30 seconds.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200 hover:shadow-md active:shadow-xs active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:bg-blue-600"
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
