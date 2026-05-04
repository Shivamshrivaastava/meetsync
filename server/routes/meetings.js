const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');
const groqService = require('../services/groqService');

// POST /api/meetings - Create a new meeting with AI processing
router.post('/', async (req, res) => {
  try {
    const { title, transcript, date } = req.body;

    if (!title || !transcript) {
      return res.status(400).json({ 
        error: 'Title and transcript are required' 
      });
    }

    // Process transcript with Groq AI
    const aiAnalysis = await groqService.processTranscript(transcript);

    // Create new meeting with AI analysis
    const meeting = new Meeting({
      title,
      transcript,
      date: date || new Date(),
      summary: aiAnalysis.summary,
      keyPoints: aiAnalysis.keyPoints || [],
      deadlines: aiAnalysis.deadlines || [],
      opportunities: aiAnalysis.opportunities || [],
      decisions: aiAnalysis.decisions || [],
      actionItems: aiAnalysis.actionItems || [],
      tags: aiAnalysis.tags || [],
      whatYouMissed: aiAnalysis.whatYouMissed
    });

    await meeting.save();

    res.status(201).json(meeting);
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({ 
      error: 'Failed to create meeting', 
      details: error.message 
    });
  }
});

// GET /api/meetings - Get all meetings
router.get('/', async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .sort({ date: -1 })
      .select('-transcript'); // Exclude transcript for list view
    
    res.json(meetings);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ 
      error: 'Failed to fetch meetings' 
    });
  }
});

// GET /api/meetings/:id - Get a specific meeting
router.get('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    
    if (!meeting) {
      return res.status(404).json({ 
        error: 'Meeting not found' 
      });
    }

    res.json(meeting);
  } catch (error) {
    console.error('Error fetching meeting:', error);
    res.status(500).json({ 
      error: 'Failed to fetch meeting' 
    });
  }
});

// PUT /api/meetings/:id - Update a meeting
router.put('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!meeting) {
      return res.status(404).json({ 
        error: 'Meeting not found' 
      });
    }

    res.json(meeting);
  } catch (error) {
    console.error('Error updating meeting:', error);
    res.status(500).json({ 
      error: 'Failed to update meeting' 
    });
  }
});

// DELETE /api/meetings/:id - Delete a meeting
router.delete('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);

    if (!meeting) {
      return res.status(404).json({ 
        error: 'Meeting not found' 
      });
    }

    res.json({ 
      message: 'Meeting deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    res.status(500).json({ 
      error: 'Failed to delete meeting' 
    });
  }
});

// POST /api/meetings/:id/process - Reprocess transcript with AI
router.post('/:id/process', async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ 
        error: 'Meeting not found' 
      });
    }

    // Reprocess transcript with Groq AI
    const aiAnalysis = await groqService.processTranscript(meeting.transcript);

    // Update meeting with new AI analysis
    meeting.summary = aiAnalysis.summary;
    meeting.keyPoints = aiAnalysis.keyPoints || [];
    meeting.deadlines = aiAnalysis.deadlines || [];
    meeting.opportunities = aiAnalysis.opportunities || [];
    meeting.decisions = aiAnalysis.decisions || [];
    meeting.actionItems = aiAnalysis.actionItems || [];
    meeting.tags = aiAnalysis.tags || [];
    meeting.whatYouMissed = aiAnalysis.whatYouMissed;

    await meeting.save();

    res.json(meeting);
  } catch (error) {
    console.error('Error reprocessing meeting:', error);
    res.status(500).json({ 
      error: 'Failed to reprocess meeting', 
      details: error.message 
    });
  }
});

module.exports = router;
