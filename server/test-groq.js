require('dotenv').config();
const groqService = require('./services/groqService');

async function testGroq() {
  try {
    console.log('Testing Groq service...');
    
    const testTranscript = `John: Good morning everyone. Let's start today's standup meeting.
Sarah: Hi John. I worked on the user authentication module yesterday and completed the login functionality.
Mike: I integrated the frontend with the new API endpoints and fixed several bugs in the dashboard.
John: Great progress. Sarah, can you complete the password reset feature by Friday? We need it for the client demo.
Sarah: Yes, I'll prioritize that and have it ready by Thursday.
Mike: I'll be working on improving the performance of the data loading this week.
John: Perfect. Also, we have a new opportunity to present our project at the tech conference next month. Sarah, can you prepare a demo?
Sarah: Absolutely! I'd love to present our work.
John: Meeting adjourned. See you all tomorrow.`;

    const result = await groqService.processTranscript(testTranscript);
    console.log('Groq service test successful!');
    console.log('Result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Groq service test failed:', error.message);
    console.error('Full error:', error);
  }
}

testGroq();
