const Groq = require('groq-sdk');

class GroqService {
  constructor() {
    this.groq = null;
  }

  getClient() {
    if (!this.groq) {
      if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY environment variable is not set');
      }
      this.groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
      });
    }
    return this.groq;
  }

  async processTranscript(transcript) {
    try {
      const prompt = `
        Analyze the following meeting transcript and extract structured information. 
        Return ONLY a valid JSON response (no additional text, no explanations, no markdown formatting).
        The response must start with { and end with }.
        
        {
          "summary": "Brief 2-3 sentence summary of the meeting",
          "keyPoints": ["Main point 1", "Main point 2", "Main point 3"],
          "deadlines": [
            {
              "title": "Deadline title",
              "date": "YYYY-MM-DD",
              "description": "Description of what's due"
            }
          ],
          "opportunities": [
            {
              "title": "Opportunity title",
              "description": "Description of the opportunity",
              "priority": "high|medium|low"
            }
          ],
          "decisions": [
            {
              "title": "Decision title",
              "description": "What was decided",
              "madeBy": "Who made the decision"
            }
          ],
          "actionItems": [
            {
              "task": "Task description",
              "assignedTo": "Person assigned",
              "dueDate": "YYYY-MM-DD",
              "status": "pending"
            }
          ],
          "tags": ["frontend", "backend", "hiring", "strategy", "technical", "business", "other"],
          "whatYouMissed": "If someone missed this meeting, what are the most important things they need to know?"
        }
        
        Meeting Transcript:
        ${transcript}
      `;

      const response = await this.getClient().chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      });

      const result = response.choices[0].message.content;
      
      // Extract JSON from response (handle potential markdown or extra text)
      let jsonStr = result;
      
      // Try to extract JSON from the response
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      
      // Parse the JSON response
      let parsedResult;
      try {
        parsedResult = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error('Failed to parse Groq response as JSON:', parseError);
        console.error('Raw response:', result);
        console.error('Extracted JSON string:', jsonStr);
        throw new Error('Invalid JSON response from Groq AI');
      }
      
      return parsedResult;
    } catch (error) {
      console.error('Error processing transcript with Groq:', error);
      throw new Error('Failed to process transcript with AI');
    }
  }
}

module.exports = new GroqService();
