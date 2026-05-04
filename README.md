# 🧠 MeetSync – AI-Powered Meeting Intelligence System

An intelligent meeting analysis system that uses **Groq AI** to transform unstructured meeting transcripts into actionable insights, summaries, and structured data.

## 🎯 Features

- **AI-Powered Analysis**: Uses Groq AI for ultra-fast transcript processing
- **Smart Summaries**: Automatically generates concise meeting summaries
- **Key Insights Extraction**: Identifies deadlines, opportunities, decisions, and action items
- **FOMO Prevention**: "What You Missed" section for quick catch-up
- **Modern Dashboard**: Beautiful React UI with Tailwind CSS
- **Real-time Processing**: Fast AI inference with Groq's optimized models
- **Search & Filter**: Find meetings quickly with intelligent search
- **Tag-based Organization**: Categorize meetings by type (frontend, backend, hiring, etc.)

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - RESTful API server
- **MongoDB** + **Mongoose** - Database for meeting insights
- **Groq AI SDK** - AI processing and analysis
- **JWT** - Authentication (ready for future features)

### Frontend
- **React 19** + **Vite** - Modern React development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Groq AI API key (free at [console.groq.com](https://console.groq.com))

### Installation

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd meetsync
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Configuration**
   
   Copy the provided `.env` file or create your own:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configurations:
   ```env
   # Groq AI API Key (get from https://console.groq.com)
   GROQ_API_KEY=your_groq_api_key_here
   
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/meetsync
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # JWT Secret (for future authentication)
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or connect to your MongoDB Atlas/Cloud instance
   ```

5. **Run the application**
   ```bash
   # Start both frontend and backend concurrently
   npm run dev
   
   # Or start individually:
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 📖 Usage Guide

### Creating Your First Meeting

1. **Open the dashboard** at http://localhost:5173
2. **Click "New Meeting"** button
3. **Fill in meeting details**:
   - Meeting title (e.g., "Daily Standup - Development Team")
   - Meeting date
   - Meeting transcript (paste or type)
4. **Use sample transcript** (optional) to test with pre-filled data
5. **Click "Create Meeting"** and wait for AI processing

### Understanding AI Analysis

The system automatically extracts:
- **Summary**: 2-3 sentence overview
- **Key Points**: Main discussion topics
- **Deadlines**: Time-sensitive tasks with dates
- **Opportunities**: Growth opportunities with priority levels
- **Decisions**: Important decisions made during meeting
- **Action Items**: Tasks assigned to team members
- **Tags**: Automatic categorization (frontend, backend, hiring, etc.)
- **What You Missed**: Critical information for absent participants

### Sample Transcript Format

```
John: Good morning everyone. Let's start today's standup meeting.
Sarah: Hi John. I worked on the user authentication module yesterday and completed the login functionality.
Mike: I integrated the frontend with the new API endpoints and fixed several bugs in the dashboard.
John: Great progress. Sarah, can you complete the password reset feature by Friday? We need it for the client demo.
Sarah: Yes, I'll prioritize that and have it ready by Thursday.
Mike: I'll be working on improving the performance of the data loading this week.
John: Perfect. Also, we have a new opportunity to present our project at the tech conference next month.
```

## 🔧 API Endpoints

### Meetings
- `GET /api/meetings` - Get all meetings
- `GET /api/meetings/:id` - Get specific meeting
- `POST /api/meetings` - Create new meeting
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Delete meeting
- `POST /api/meetings/:id/process` - Reprocess with AI

### Health
- `GET /api/health` - Check API status

## 🧠 Groq AI Integration

### Why Groq?
- **Ultra-fast inference** - Low latency processing
- **Free tier available** - No cost for development
- **OpenAI-compatible API** - Easy integration
- **Optimized models** - Llama3-70B for best results

### AI Processing Flow
1. User submits transcript
2. System sends to Groq with structured prompt
3. Groq analyzes and returns JSON with insights
4. Backend processes and stores in MongoDB
5. Frontend displays structured results

## 🎨 UI Components

### Dashboard
- Meeting cards with key insights preview
- Search and filter functionality
- Real-time API status indicator
- Responsive design for all devices

### Meeting Detail View
- Complete AI analysis display
- Reprocess capability for updated insights
- Full transcript access
- Action item tracking

### New Meeting Form
- Intuitive transcript input
- Sample data for testing
- Real-time validation
- Processing status indicators

## 🔍 Features in Detail

### Search & Filtering
- **Text Search**: Search meeting titles and summaries
- **Tag Filtering**: Filter by meeting categories
- **Real-time Results**: Instant filtering as you type

### Meeting Cards
- **Quick Overview**: Title, date, summary preview
- **Key Metrics**: Deadlines, opportunities, action items count
- **Visual Tags**: Color-coded categories
- **Priority Indicators**: High/medium/low priority opportunities

### Detailed Analysis
- **Structured Layout**: Organized sections for each insight type
- **Color Coding**: Visual hierarchy for importance
- **Actionable Items**: Clear assignments and due dates
- **FOMO Section**: Critical information for absent team members

## 🚀 Deployment

### Production Setup
1. **Environment Variables**: Set production values in `.env`
2. **Database**: Use MongoDB Atlas or production MongoDB instance
3. **Build Frontend**: `npm run build`
4. **Start Server**: `npm start`

### Docker Support (Coming Soon)
```dockerfile
# Dockerfile and docker-compose.yml will be added
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 Development Notes

### AI Model Configuration
- Uses `llama3-70b-8192` model for best results
- Temperature set to 0.3 for consistent outputs
- Max tokens: 4000 for comprehensive analysis

### Error Handling
- Graceful API error handling
- User-friendly error messages
- Retry mechanisms for AI processing
- Input validation and sanitization

### Performance Optimizations
- Lazy loading for meeting details
- Efficient API calls with caching
- Optimized Tailwind CSS build
- Component-level state management

## 🔒 Security Considerations

- Environment variables for sensitive data
- Input validation on all endpoints
- Rate limiting ready for implementation
- CORS configuration for frontend access
- JWT authentication structure in place

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if backend server is running on port 5000
   - Verify MongoDB connection string
   - Check Groq API key validity

2. **AI Processing Errors**
   - Verify Groq API key has sufficient credits
   - Check transcript length (minimum 50 characters)
   - Ensure proper transcript format with speaker names

3. **Frontend Not Loading**
   - Check if client server is running on port 5173
   - Verify Tailwind CSS configuration
   - Check browser console for errors

### Debug Mode
Set `NODE_ENV=development` for detailed logging and error messages.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **Groq AI** - For providing fast and accessible AI inference
- **React & Vite** - For excellent development experience
- **Tailwind CSS** - For utility-first styling approach
- **Lucide Icons** - For beautiful and consistent icons

---

**MeetSync** - Transform your meetings from time-wasters to productivity powerhouses with AI-powered intelligence! 🚀
