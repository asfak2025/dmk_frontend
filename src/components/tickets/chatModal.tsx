import React, {
  useState,
  useRef,
  useEffect,
  ReactElement,
  ReactNode,
} from "react";
import { X, Send, Plus, PhoneCall, Bot } from "lucide-react";
import Modal from "../Modal/modal";
// import CreateTicketModal from './createTicketModal';
import { useLogOut } from "@/hooks/useLogout";
import { useAppContext } from "@/hooks/context";
import { apiHeader } from "@/lib/utils";
import { Button } from "../ui/button";
import Alert from "../alert/alert";
import { useAlert } from "@/hooks/alertHook";
import { getFromLocalStorage } from "../encryption/encryption";

interface Message {
  content: string | ReactElement;
  msgId: string;
  readFlag: boolean;
  senderId: string;
  timestamp: string;
  type: string;
}
interface ChatModalProps {
  onClose: () => void;
  ticketId?: string;
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose, ticketId }) => {
  const { alert, showAlert, hideAlert } = useAlert();
  const issues = [
    { label: "Unable to make phonecall", icon: <PhoneCall /> },
    { label: "App Crashed", icon: "💥" },
    { label: "Network Issue", icon: "🌐" },
    { label: "Microphone not working", icon: "🎤" },
  ];
  const renderMessage = (
    <div>
      {/* <p className="text-xs mb-5 text-gray-500 font-medium">
          Select an option to create ticket and get help from <span className="font-semibold">CompanyName Support</span>:
        </p> */}

      <div className="flex flex-wrap gap-3">
        {issues.map((issue, idx) => (
          <button
            key={idx}
            onClick={() => handleCreateTicket(issue.label)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 shadow hover:bg-gray-100 transition"
          >
            <span>{issue.icon}</span>
            {issue.label}
          </button>
        ))}
      </div>
    </div>
  );
  const [suggestion, setSuggestion] = useState([]);
  const token = localStorage.getItem("token");
  // const [tokenId,setTokenId] = useState('')
  const logOut = useLogOut();
  const [page, setPage] = useState(1);
  const { URL, userData } = useAppContext();
  const header = apiHeader();
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your AI assistant. How can I help you today?",
      msgId: Date.now().toString(),
      readFlag: false,
      senderId: "adminstart",
      timestamp: new Date().toISOString(),
      type: "bot",
    },
  ]);
  const [newTicket, setIsNewTicket] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  // const [ticketStatus, setTicketStatus] = useState('Open');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const orgType=getFromLocalStorage("orgType")

  //   useEffect(() => {
  //     if(ticketId){
  //        handleGetMessages()
  //         scrollToBottom();
  //     }else{
  //       handleNewTicket()
  //     }

  //         // setTokenId(tokenId)

  //   },[]);

  useEffect(() => {
    scrollToBottom();
    // if(messages.length ===0){
    //     handleNewTicket()
    // }else{
    //     scrollToBottom()
    // }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGetMessages = async () => {
    try {
      if (!token) {
        logOut();
      }
      const response = await fetch(
        `${URL}/tickets/getMessages/${ticketId}?page=${page}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        const reversedMessages = data.slice().reverse();
        if (messages.length < 1) {
          setMessages({ ...reversedMessages });
        } else {
          setMessages((prev: any) => [...reversedMessages, ...prev]);
        }
      } else {
        showAlert("Error fetching Ticket ", "error");
        console.log("error");
      }
    } catch (e) {
      showAlert("unexpected error occured", "error");
    }
  };

  // const formatTimestamp = (timestamp: string) => {
  //   const date = new Date(timestamp);
  //   const now = new Date();
  //   const isToday = date.toDateString() === now.toDateString();

  //   if (isToday) {
  //     return date.toLocaleTimeString('en-US', {
  //       hour: '2-digit',
  //       minute: '2-digit'
  //     });
  //   } else {
  //     return date.toLocaleDateString('en-US', {
  //       month: 'short',
  //       day: 'numeric',
  //       hour: '2-digit',
  //       minute: '2-digit'
  //     });
  //   }
  // };

  //   const handleSendMessage = async() => {

  //     const  messageAppend = {
  //        msg: inputMessage,
  //       msgId: Date.now().toString(),
  //       readFlag: false,
  //       senderId: 'sender' + Date.now(),
  //       timestamp: new Date().toISOString(),
  //       type: 'user'
  //     }

  //     if (inputMessage.trim() ) {
  //       try{
  //         if(!token){
  //             logOut()
  //         }
  //         const response= await fetch(`${URL}/tickets/send`,{
  //               method:"POST",
  //               headers:header,
  //               body:JSON.stringify({
  //                 message:inputMessage,
  //                 ticketId:ticketId
  //         })
  //             })
  //             if(response.status ===200){
  //               setMessages((prev)=>[...prev,messageAppend])
  //               setInputMessage('')
  //             }

  //       }catch(e){
  //         console.log(e)
  //       }

  //       // (newMessage.trim());
  //       // setNewMessage('');
  //     }
  //   };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();

      //   handleSendMessage();
    }
  };

  const handleCreateTicket = async (message: string) => {
    try {
      if (!header) {
        logOut();
      }
      const payload = {
        userName: userData.name,
        message: message,
        assignedTo: "Support",
        orgId: userData.orgId,
      };

      const response = await fetch(`${URL}/tickets/create`, {
        method: "POST",
        headers: header,
        body: JSON.stringify(payload),
      });
      if (response.status === 201) {
        const messageAppend = {
          content: message,
          msgId: Date.now().toString(),
          readFlag: false,
          senderId: "sender" + Date.now(),
          timestamp: new Date().toISOString(),
          type: "user",
        };
        showAlert("Ticket Created successfully ", "success");
        setMessages([messageAppend]);
        setIsNewTicket(false);
      } else {
        showAlert("Error creating Ticket ", "error");
      }
    } catch (e) {
      showAlert("Unexpected error ", "error");
    }
  };

  //   const handleNewTicket = () => {
  //     setIsNewTicket(true)
  //     setMessages([
  //       {
  //       content:renderMessage,
  //   msgId:'1',
  //   readFlag: false,
  //   senderId: 'adminstart',
  //   timestamp: '',
  //   type: 'admin'
  //     }
  //     ])
  //   };
  // function renderMessageContent(content: string) {
  //   const urlRegex = /(https?:\/\/[^\s]+)/g;
  //   const parts = content.split(urlRegex);

  //   return parts.map((part, i) => {
  //     if (urlRegex.test(part)) {
  //       return (
  //         <a
  //           key={i}
  //           href={part}
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           className="text-blue-500 underline break-all"
  //         >
  //           {part}
  //         </a>
  //       );
  //     }
  //     return <span key={i}>{part}</span>;
  //   });
  // }

  function renderMessageContent(content: string): ReactNode {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);

    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline break-all"
          >
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  }

  const sendMessage = async (msg?: string) => {
    const userMessage = msg?.trim() || inputMessage.trim();

    console.log("send message called");
    if (!userMessage.trim()) return;
    setIsTyping(true);
    console.log("input message", userMessage);
    
    setInputMessage("");
    setMessages((prev) => [
      ...prev,
      {
        content: userMessage,
        msgId: Date.now().toString(),
        readFlag: false,
        senderId: "adminstart",
        timestamp: new Date().toISOString(),
        type: "user",
      },
    ]);

    // Step 2: Final prompt with instructions

    try {
      const response = await fetch(`/nextApi/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userMessage,
          conversationHistory: messages,
          promptType: "chatBot",
          orgType:orgType
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("conversation data", data);

        setSuggestion(data.next_suggestion);
        setMessages((prev) => [
          ...prev,
          ...data.conversationHistory.filter((item) => item.type === "bot"),
        ]);
        setIsTyping(false);
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  //if (!isOpen) return null;
  //   console.log("appended messages",messages)
  return (
    <div className="fixed inset-0 z-50 flex transition ease-in  items-end justify-end p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 " onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white  rounded-lg shadow-xl w-full max-w-md h-[600px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-blue border-b border-gray-200 p-4">
          {/* Chat Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">ChatBot</h2>
            <div className="flex items-center gap-2">
              {/* {!newTicket &&<Button variant={'outline'}
                onClick={handleNewTicket}
                
              >
                New Ticket
              </Button>} */}
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 relative">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative p-4 space-y-4">
            {messages?.map((message, index) => (
              <div
                key={message?.msgId}
                className={`flex ${
                  message?.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex flex-col max-w-xs break-words whitespace-pre-wrap">
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message?.type === "user"
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-white text-gray-800 rounded-bl-md shadow-sm"
                    }`}
                  >
                    {typeof message?.content === "string"
                      ? renderMessageContent(message?.content)
                      : message?.content}

                    {/* ✅ Show suggestions only if this is the last bot message */}
                    {message?.type !== "user" &&
                      index === messages.length - 1 &&
                      suggestion?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {suggestion.map((item, sIndex) => (
                            <button
                              key={sIndex}
                              onClick={() => {
                                sendMessage(item);
                              }} // 👈 sets the input
                              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer transition"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>

                  <div
                    className={`text-xs text-gray-500 mt-1 ${
                      message?.type === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {message?.timestamp &&
                      new Date(message?.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                    {message?.type === "user" ? "YOU" : ""}
                  </div>
                </div>
              </div>
            ))}
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-2">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-lg border border-gray-200">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!inputMessage.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed p-3 rounded-full transition-colors"
            >
              <Send size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
      <Alert alert={alert} hideAlert={hideAlert} />
    </div>
  );
};

export default ChatModal;
// Demo Component
// export default function ChatModalDemo() {
//   const [isModalOpen, setIsModalOpen] = useState(true);

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       {!isModalOpen && (
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
//         >
//           Open ChatBot
//         </button>
//       )}

//       <ChatModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//     </div>
//   );
// }
