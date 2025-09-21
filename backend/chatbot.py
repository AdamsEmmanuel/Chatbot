import asyncio
import random
from typing import List, Dict

class ChatbotService:
    """Simple chatbot service with predefined responses."""
    
    def __init__(self):
        self.responses = {
            "greeting": [
                "Hello! How can I help you today?",
                "Hi there! What would you like to know?",
                "Greetings! I'm here to assist you.",
                "Hey! How can I assist you today?"
            ],
            "goodbye": [
                "Goodbye! Have a great day!",
                "See you later! Take care!",
                "Bye! Feel free to come back anytime!",
                "Farewell! It was nice chatting with you!"
            ],
            "help": [
                "I can help you with various topics like finance, health, business, and technology. What would you like to know?",
                "I'm here to assist you! You can ask me about different subjects or just have a casual conversation.",
                "Feel free to ask me anything! I can discuss finance, health, business, tech, or just chat."
            ],
            "finance": [
                "Finance is about managing money, investments, and financial planning. What specific aspect interests you?",
                "I can help with budgeting, investing, saving strategies, or general financial advice. What would you like to know?",
                "Financial literacy is important! Are you interested in personal finance, investing, or business finance?"
            ],
            "health": [
                "Health and wellness are crucial for a good life. What health topic would you like to discuss?",
                "I can share general health information, but remember to consult healthcare professionals for medical advice.",
                "Maintaining good health involves proper nutrition, exercise, and regular check-ups. What interests you most?"
            ],
            "business": [
                "Business involves strategy, management, marketing, and operations. What aspect would you like to explore?",
                "I can discuss entrepreneurship, business planning, marketing strategies, or management principles.",
                "Business success often depends on understanding your market and customers. What's your business interest?"
            ],
            "technology": [
                "Technology is rapidly evolving! Are you interested in AI, web development, mobile apps, or something else?",
                "I can discuss various tech topics like programming, artificial intelligence, cybersecurity, or emerging technologies.",
                "Technology shapes our world. What specific tech area would you like to learn about?"
            ],
            "default": [
                "That's interesting! Can you tell me more about what you'd like to know?",
                "I understand. What specific information are you looking for?",
                "Thanks for sharing! How can I help you with that?",
                "I see. What would you like to explore about this topic?",
                "That's a good question! Let me think about how I can help you with that.",
                "Interesting point! What aspect of this would you like to discuss further?"
            ]
        }
        
        self.keywords = {
            "greeting": ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"],
            "goodbye": ["bye", "goodbye", "see you", "farewell", "take care", "later"],
            "help": ["help", "assist", "support", "what can you do", "how can you help"],
            "finance": ["money", "finance", "investment", "budget", "saving", "financial", "economy", "stock"],
            "health": ["health", "wellness", "fitness", "medical", "doctor", "exercise", "nutrition", "diet"],
            "business": ["business", "company", "startup", "entrepreneur", "marketing", "management", "strategy"],
            "technology": ["technology", "tech", "computer", "software", "ai", "artificial intelligence", "programming", "code"]
        }
    
    async def generate_response(self, message: str, user_context: Dict = None) -> str:
        """Generate a response based on the user's message."""
        message_lower = message.lower()
        
        # Add some realistic delay
        await asyncio.sleep(random.uniform(0.5, 2.0))
        
        # Find the best matching category
        best_category = "default"
        max_matches = 0
        
        for category, keywords in self.keywords.items():
            matches = sum(1 for keyword in keywords if keyword in message_lower)
            if matches > max_matches:
                max_matches = matches
                best_category = category
        
        # Get a random response from the best category
        responses = self.responses[best_category]
        response = random.choice(responses)
        
        # Add some personalization if user context is available
        if user_context and user_context.get("username"):
            if best_category == "greeting":
                response = f"Hello {user_context['username']}! " + response.split("Hello! ", 1)[-1]
        
        return response

# Global chatbot instance
chatbot = ChatbotService()
