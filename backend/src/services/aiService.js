// Mock responses for demonstration
const responses = [
  "That's an interesting perspective! Tell me more about it.",
  "I understand what you mean. Here's what I think...",
  "Thanks for sharing that with me. Let me help you with that.",
  "I find that fascinating! Have you considered...",
  "That's a great question. From my analysis...",
  "I see where you're coming from. Let me offer a different view...",
  "Based on what you've told me...",
  "That's quite intriguing! Let's explore that further...",
  "I appreciate you sharing that. Here's my thought...",
  "Let me process that for a moment... Here's what I think..."
];

// Simple keyword-based response generation
const keywordResponses = {
  'hello': 'Hi there! How can I help you today?',
  'help': 'I\'m here to help! What do you need assistance with?',
  'bye': 'Goodbye! Have a great day!',
  'thanks': 'You\'re welcome! Is there anything else I can help you with?',
  'how are you': 'I\'m functioning well, thank you! How can I assist you today?'
};

/**
 * Generates a mock AI response based on user input
 * In a production environment, this would be replaced with a real AI model
 * @param {string} userMessage - The user's message
 * @returns {Promise<string>} The AI's response
 */
const generateAiResponse = async (userMessage) => {
  // Convert to lowercase for keyword matching
  const lowercaseMessage = userMessage.toLowerCase();

  // Check for keyword matches
  for (const [keyword, response] of Object.entries(keywordResponses)) {
    if (lowercaseMessage.includes(keyword)) {
      return response;
    }
  }

  // If no keyword match, return a random response
  const randomIndex = Math.floor(Math.random() * responses.length);
  const baseResponse = responses[randomIndex];

  // Add some context from the user's message
  const words = userMessage.split(' ');
  if (words.length > 3) {
    const contextWord = words[Math.floor(Math.random() * words.length)];
    return `${baseResponse} I noticed you mentioned "${contextWord}"...`;
  }

  return baseResponse;
};

// Add a small delay to simulate processing time
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Wrapper function that adds a realistic delay
const generateResponse = async (userMessage) => {
  // Add a random delay between 1-2 seconds
  const randomDelay = Math.floor(Math.random() * 1000) + 1000;
  await delay(randomDelay);
  
  return generateAiResponse(userMessage);
};

module.exports = {
  generateAiResponse: generateResponse
}; 