// // pages/chat.tsx (for Pages Router)
// // or app/chat/page.tsx (for App Router)
// "use client";
// import Chat from '@/components/chat/Chat';
// import React from 'react';

// const ChatPage: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto py-8">
//         <h1 className="text-3xl font-bold text-center mb-8">
//           Gemini AI Chat
//         </h1>
//         <Chat />
//       </div>
//     </div>
//   );
// };

// export default ChatPage;

// // For App Router (app/chat/page.tsx), use this instead:
// /*
// 'use client';

// import React from 'react';
// import Chat from '../../components/Chat'; // Adjust path as needed

// export default function ChatPage() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto py-8">
//         <h1 className="text-3xl font-bold text-center mb-8">
//           Gemini AI Chat
//         </h1>
//         <Chat />
//       </div>
//     </div>
//   );
// }
// */






"use client";


// Example client-side usage (React component)
import { useState } from 'react';

interface Message {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const userMessage = input;
    setInput('');

    try {
      const response = await fetch(`/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          conversationHistory: messages,
          
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(data.conversationHistory);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <strong>{message.role === 'user' ? 'You: ' : 'AI: '}</strong>
            {message.parts[0].text}
          </div>
        ))}
      </div>
      
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          disabled={loading}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

