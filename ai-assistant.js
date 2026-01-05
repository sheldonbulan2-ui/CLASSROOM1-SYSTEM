// AI Academic Assistant Module

let chatHistory = [];

function loadAIAssistant() {
    const chatContainer = document.getElementById('aiChat');
    chatContainer.innerHTML = `
        <div class="ai-message assistant">
            <strong>AI Assistant:</strong> Hello! I'm your AI Academic Assistant. I can help you with:
            <ul style="margin-top: 10px; padding-left: 20px;">
                <li>Explaining lessons and topics</li>
                <li>Summarizing study materials</li>
                <li>Providing study tips</li>
                <li>Creating sample quiz questions</li>
            </ul>
            <p style="margin-top: 10px;">Ask me anything or upload your notes!</p>
        </div>
    `;
    chatHistory = [];
}

async function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    const fileInput = document.getElementById('aiFileInput');
    const file = fileInput.files[0];
    
    if (!message && !file) {
        alert('Please enter a message or upload a file');
        return;
    }
    
    const chatContainer = document.getElementById('aiChat');
    const user = window.authModule.getCurrentUser();
    
    // Add user message
    if (message) {
        const userMsg = document.createElement('div');
        userMsg.className = 'ai-message user';
        userMsg.textContent = message;
        chatContainer.appendChild(userMsg);
        chatHistory.push({ role: 'user', content: message });
        input.value = '';
    }
    
    // Handle file upload
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const fileMsg = document.createElement('div');
            fileMsg.className = 'ai-message user';
            fileMsg.innerHTML = `<strong>📎 ${file.name}</strong><br>Please analyze this file and help me understand it.`;
            chatContainer.appendChild(fileMsg);
            
            // In production, extract text from file
            // For demo, we'll use the filename
            chatHistory.push({ role: 'user', content: `Please analyze the file: ${file.name}` });
            
            await getAIResponse(`Please analyze the uploaded file "${file.name}" and provide a summary and explanation.`);
            fileInput.value = '';
        };
        reader.readAsDataURL(file);
    } else {
        await getAIResponse(message);
    }
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function getAIResponse(userMessage) {
    const chatContainer = document.getElementById('aiChat');
    
    // Show loading
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'ai-message assistant';
    loadingMsg.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; margin: 0 auto;"></div>';
    chatContainer.appendChild(loadingMsg);
    
    try {
        // In production, use OpenAI API
        // For demo, we'll use a mock response
        const response = await mockAIResponse(userMessage);
        
        // Remove loading
        loadingMsg.remove();
        
        // Add AI response
        const aiMsg = document.createElement('div');
        aiMsg.className = 'ai-message assistant';
        aiMsg.innerHTML = `<strong>AI Assistant:</strong> ${response}`;
        chatContainer.appendChild(aiMsg);
        
        chatHistory.push({ role: 'assistant', content: response });
    } catch (error) {
        loadingMsg.remove();
        const errorMsg = document.createElement('div');
        errorMsg.className = 'ai-message assistant';
        errorMsg.innerHTML = `<strong>AI Assistant:</strong> Sorry, I encountered an error. Please try again.`;
        chatContainer.appendChild(errorMsg);
        console.error('AI Error:', error);
    }
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function mockAIResponse(message) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock responses based on keywords
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('explain') || lowerMessage.includes('what is')) {
        return `I'd be happy to explain! Based on your question, here's a student-friendly explanation:

**Key Concepts:**
- The main idea is to break down complex topics into simpler parts
- Understanding the basics first helps build a strong foundation
- Practice and examples make concepts clearer

**Study Tip:** Try to relate this to something you already know. Making connections helps with memory!

Would you like me to go deeper into any specific part?`;
    } else if (lowerMessage.includes('summary') || lowerMessage.includes('summarize')) {
        return `Here's a concise summary:

**Main Points:**
1. Core concept overview
2. Important details to remember
3. Key takeaways

**Quick Review:**
- Focus on understanding the main ideas
- Note any formulas or important facts
- Practice with examples

This summary should help you review quickly before exams!`;
    } else if (lowerMessage.includes('quiz') || lowerMessage.includes('question')) {
        return `Here are some sample quiz questions to test your understanding:

**Question 1:** [Sample question based on the topic]
- A) Option A
- B) Option B
- C) Option C
- D) Option D

**Question 2:** [Another practice question]

**Study Tips:**
- Review the material before attempting
- Explain your answers to reinforce learning
- Focus on understanding, not just memorization

Would you like more questions or explanations?`;
    } else if (lowerMessage.includes('tip') || lowerMessage.includes('study')) {
        return `Here are some effective study tips:

**Active Learning:**
- Take notes in your own words
- Teach the concept to someone else
- Create mind maps or diagrams

**Time Management:**
- Use the Pomodoro Technique (25 min study, 5 min break)
- Study in short, focused sessions
- Review regularly instead of cramming

**Memory Techniques:**
- Use mnemonics for lists
- Connect new info to what you know
- Practice retrieval (test yourself)

**Best Practices:**
- Find a quiet, distraction-free space
- Stay organized with a study schedule
- Get enough sleep for better retention

Good luck with your studies!`;
    } else if (lowerMessage.includes('file') || lowerMessage.includes('upload')) {
        return `I've analyzed your uploaded file. Here's what I found:

**File Summary:**
- Main topics covered: [Key concepts]
- Important points: [Key takeaways]
- Areas to focus on: [Study priorities]

**Explanation:**
The material covers [topic explanation]. The key concepts are [concepts]. To better understand this, I recommend [suggestions].

**Study Suggestions:**
1. Review the main concepts first
2. Practice with examples
3. Create summary notes
4. Test your understanding

Would you like me to explain any specific part in more detail?`;
    } else {
        return `I understand you're asking about: "${message}"

Here's a helpful response:

**Understanding the Topic:**
This is an important concept that relates to [context]. The main idea is [explanation].

**Key Points to Remember:**
- Point 1: [Explanation]
- Point 2: [Explanation]
- Point 3: [Explanation]

**How to Study This:**
1. Start with the basics
2. Build up to more complex ideas
3. Practice with examples
4. Review regularly

**Additional Help:**
If you need more specific help, try asking me to:
- "Explain [specific topic]"
- "Give me a summary of [topic]"
- "Create quiz questions about [topic]"
- "Study tips for [subject]"

Is there a specific part you'd like me to explain further?`;
    }
}

// In production, replace with actual OpenAI API call
async function callOpenAIAPI(messages) {
    // This would be the actual API call
    /*
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful academic assistant for students. Provide clear, student-friendly explanations, summaries, study tips, and quiz questions.'
                },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 500
        })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
    */
    
    // For demo, use mock
    return await mockAIResponse(messages[messages.length - 1].content);
}

// Make functions available globally
window.aiAssistantModule = {
    loadAIAssistant,
    sendAIMessage,
    getAIResponse
};

