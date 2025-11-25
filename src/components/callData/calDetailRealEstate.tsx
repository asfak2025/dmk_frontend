


'use client'
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Phone, User, Star, Calendar, CheckCircle, MessageCircle, X, Play, Pause, Download, Bot, RotateCcw, Loader2, Send, Search, ChevronDown } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useAppContext } from "@/hooks/context";
import { Button } from "@/components/ui/button";

interface Segment {
    speaker: string;
    text: string;
    timestamp?: string;
    language?: string;
}

export interface CallData {

    id: string;
    audioUrl: string;
    duration: string;
    customerPhone?: string;
    callStartTime?: string;
    emotionalState: string;
    gender?: string;
    overall_performance_rating?: string;
    issue_urgency?: string;
    positive_feedback?: string;
    improvement_feedback?: string;
    communication_analysis?: string;
    conversation_summary?: string;
    call_outcome?: string;
    emotional_state?: string;
    communication_quality?: string;
    transcription?: Segment[];
    userNo: string;
    timestamp: string;
}

interface CallDetailsSheetProps {
    isOpen: boolean;
    call: CallData | null;
    onClose: () => void;
    transcribeChat: any;
}

const AudioUrl = process.env.NEXT_PUBLIC_AUDIO_URL;

// Move HighlightedText component outside of CallDetailsSheet
const HighlightedText: React.FC<{ text: string; highlight: string }> = ({ text, highlight }) => {
    if (!highlight.trim()) {
        return <p className="text-sm">{text}</p>;
    }
    
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    
    return (
        <p className="text-sm">
            {parts.map((part, i) => 
                regex.test(part) ? 
                    <mark key={i} className="bg-yellow-200">{part}</mark> : 
                    part
            )}
        </p>
    );
};









const CallDetailsSheet: React.FC<CallDetailsSheetProps> = ({ isOpen, call, onClose, transcribeChat = [] }) => {
    const [activeTab, setActiveTab] = useState<'conversation' | 'overview' | 'chat'>('conversation');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const waveformRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const { LogUrl } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: 'Hello! I\'m your AI assistant. How can I help you today?',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const filteredTranscription = useMemo(() => {
        if (!searchQuery.trim() || !call?.transcription) {
            return call?.transcription || [];
        }
        
        const query = searchQuery.toLowerCase();
        return call.transcription.filter(segment => 
            segment.text.toLowerCase().includes(query)
        );
    }, [searchQuery, call?.transcription]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Focus search input when expanded
    useEffect(() => {
        if (isSearchExpanded && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchExpanded]);

    // Initialize WaveSurfer
    useEffect(() => {
      
        if (!isOpen || !call?.audioUrl) return;


        setIsLoadingAudio(true);
        const timeout = setTimeout(() => {
            if (!waveformRef.current) return;

            // Cleanup previous instance
            if (wavesurferRef.current) {
                wavesurferRef.current.destroy();
            }

            const wave = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: '#4b5563',
                progressColor: '#3b82f6',
                cursorColor: '#1e40af',
                barWidth: 2,
                barRadius: 3,
                cursorWidth: 1,
                height: 64,
                barGap: 2,
                normalize: true,
            });

            // Fix audio URL loading - use the correct path to your public folder
            // const audioUrl = call.audioUrl.startsWith('http') 
            //     ? call.audioUrl 
            //     : `/${call.audioUrl}`; // This assumes your audio files are in the public folder

             wave.load("/audio/asfak_audio.wav");

            wave.on('ready', () => {
                console.log('WaveSurfer is ready');
                setIsLoadingAudio(false);
            });

            wave.on('error', (error) => {
                console.error('WaveSurfer error:', error);
                setIsLoadingAudio(false);
            });

            wave.on('play', () => setIsPlaying(true));
            wave.on('pause', () => setIsPlaying(false));
            wave.on('finish', () => setIsPlaying(false));

            wavesurferRef.current = wave;

            return () => {
                wave.destroy();
            };
        }, 100);

        return () => {
            clearTimeout(timeout);
            if (wavesurferRef.current) {
                wavesurferRef.current.destroy();
                wavesurferRef.current = null;
            }
        };

      
    }, [isOpen, call?.audioUrl, LogUrl ]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const togglePlayPause = () => {
        if (wavesurferRef.current) {
            wavesurferRef.current.playPause();
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!call) return null;


    // Simulate typing effect for bot responses
    const simulateTyping = (text, callback) => {
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            callback(text);
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const simulatedResponses = [
                "That's an interesting question! Let me think about that...",
                "I understand what you're asking. Here's what I think...",
                "Great question! Based on what you've told me...",
                "I'd be happy to help with that. Here's my take...",
                "That's a complex topic. Let me break it down for you..."
            ];

            const randomResponse = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];

            simulateTyping(randomResponse, (response) => {
                const botMessage = {
                    id: Date.now() + 1,
                    type: 'bot',
                    content: response,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
                setIsLoading(false);
            });

        } catch (error) {
            setIsLoading(false);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: 'Sorry, something went wrong. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        }
    };



    const sendMessage = async () => {
        console.log("send message called")
        if (!inputValue.trim() || isLoading) return;
        setIsTyping(true);

        const userMessage = inputValue.trim();

        const conversation = transcribeChat
            .map(item => `${item.speaker.toUpperCase()}: ${item.text}`)
            .join("\n");

        // Step 2: Final prompt with instructions
        const str = `You are the assistant.\nThis is my conversation:\n${conversation}\n\nIMPORTANT: If the user asks about chat details, answer ONLY based on this conversation.`;


         const userMessageInput = {
            id: Date.now(),
            type: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessageInput]);
        setInputValue('');
        setIsLoading(true);
        try {
            const response = await fetch(`/nextApi/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: userMessage,
                    conversationHistory: messages,
                    promptType: 'transcribeChat',
                    systemPrompt: str
                }),
            });

            const data = await response.json();

            if (data.success) {
                console.log(data);
                // setMessages(data.conversationHistory);
               
                
                setMessages([...messages, ...data.conversationHistory]);
                 setIsLoading(false);
                 setIsTyping(false);

            } else {
                console.error('Error:', data.error);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setInputValue('');
            setIsLoading(false);
        }
    };

    console.log(messages, "messagess")

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // handleSendMessage();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([
            {
                id: 1,
                type: 'bot',
                content: 'Hello! I\'m your AI assistant. How can I help you today?',
                timestamp: new Date()
            }
        ]);
    };

    const formatTime = (timestamp: string | number | Date) => {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            console.error("Invalid timestamp:", timestamp);
            return "";
        }

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata", 
  }).format(date);
};

    const toggleSearch = () => {
        setIsSearchExpanded(!isSearchExpanded);
        if (!isSearchExpanded) {
            setSearchQuery('');
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="w-full max-w-[100vw] md:min-w-[60vw] p-0">
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <SheetHeader className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                        <SheetTitle className="text-xl font-semibold">Call Details</SheetTitle>
                    </SheetHeader>

                    {/* Date Display */}
                    <div className="flex items-center gap-4 p-6 border-b border-gray-200">
                        <div className="text-sm font-medium">Date:</div>
                        <div className="text-sm text-gray-700">
                            {formatDate(call.timestamp)}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 sticky top-[84px] bg-white z-10">
                        <button
                            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'conversation'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('conversation')}
                        >
                            Conversation
                        </button>
                        <button
                            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'overview'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        <button
                            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'chat'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab('chat')}
                        >
                            Chat
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === 'conversation' && (
                            <>
                                {/* Audio Player */}
                                <div className="sticky top-[0px] bg-white border-b border-gray-200 p-6 z-10">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={togglePlayPause}
                                            disabled={isLoadingAudio}
                                        >
                                            {isLoadingAudio ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
                                            ) : isPlaying ? (
                                                <Pause className="w-4 h-4" />
                                            ) : (
                                                <Play className="w-4 h-4" />
                                            )}
                                        </Button>

                                        <div className="flex-1">
                                            <div ref={waveformRef} />
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            {call.duration || 'N/A'}
                                        </div>

                                        {call.audioUrl && (
                                            // <a
                                            //     href={call.audioUrl.startsWith('http') 
                                            //         ? call.audioUrl 
                                            //         : `/${call.audioUr}`}
                                            //     download
                                            //     className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                            //     title="Download Recording"
                                            // >
                                            <a
                                                href={"../../public/audio/asfak_audio.wav"}
                                                download
                                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                                title="Download Recording"
                                            >
                                               
                                            
                                                <Download className="w-5 h-5 text-gray-600" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Search Bar - Collapsible */}
                                <div className={`sticky top-[110px] bg-white border-b border-gray-200 z-10 transition-all duration-300 ${isSearchExpanded ? 'h-16 p-4' : 'h-0 p-0 overflow-hidden'}`}>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder="Search in transcription..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={toggleSearch}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {/* <X className="w-4 h-4" /> */}
                                             <ChevronDown className="w-5 h-5 text-gray-500" />
                                        </button>
                                    </div>
                                </div>

                                {/* Search Toggle Button - Only show when search is collapsed */}
                                {!isSearchExpanded && (
                                    <button
                                        onClick={toggleSearch}
                                        className="fixed top-[150px] right-8 z-20 p-2 bg-gray-100 text-black rounded-full shadow-lg hover:bg-blue-200 transition-colors"
                                        title="Search transcription"
                                    >
                                        <Search className="w-5 h-5" />
                                    </button>
                                )}

                                {/* Transcription */}
                                <div className="p-6 space-y-6">
                                    {filteredTranscription.length ? (
                                        filteredTranscription.map((segment, index) => (
                                            <div key={index} className="flex flex-col">
                                                <div className={`flex items-center gap-2 mb-2 ${segment.speaker === 'agent' ? 'justify-end' : 'justify-start'}`}>
                                                    <span className="text-sm font-medium">
                                                        {segment.speaker === 'agent' ? 'Agent' : 'User'}
                                                    </span>
                                                    {segment.timestamp && (
                                                        <span className="text-xs text-gray-500">{segment.timestamp}</span>
                                                    )}
                                                    {segment.language && (
                                                        <span className="text-xs text-gray-500">({segment.language})</span>
                                                    )}
                                                </div>
                                                <div className={`p-3 rounded-lg max-w-[80%] ${segment.speaker === 'agent'
                                                    ? 'bg-black text-white ml-auto'
                                                    : 'bg-gray-100 text-black mr-auto'
                                                    }`}>
                                                    <HighlightedText 
                                                        text={segment.text} 
                                                        highlight={searchQuery} 
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    ) : searchQuery ? (
                                        <div className="text-center py-10 text-gray-500">
                                            No results found for "{searchQuery}"
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 text-gray-500">
                                            No transcription available
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        {activeTab === 'overview' && (
                            <div className="p-6 space-y-6">
                                {/* Call Information Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="border border-gray-200 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Phone className="w-4 h-4 text-black" />
                                            <span className="text-sm font-medium">Phone Number</span>
                                        </div>
                                        <p className="font-mono text-sm text-gray-700">
                                            {call.userNo || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="border border-gray-200 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Phone className="w-4 h-4 text-black" />
                                            <span className="text-sm font-medium">Gender</span>
                                        </div>
                                        <p className="font-mono text-sm text-gray-700">
                                            {call.gender || 'N/A'}
                                        </p>
                                    </div>

                                    <div className="border border-gray-200 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Star className="w-4 h-4 text-black" />
                                            <span className="text-sm font-medium">Rating</span>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            {call.overall_performance_rating || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Urgency */}
                                {/* <div className="border border-gray-200 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium mb-2">Issue Urgency</h3>
                                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                                        call.issue_urgency === 'high' ? 'bg-red-100 text-red-800' :
                                        call.issue_urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                        {call.issue_urgency || 'N/A'}
                                    </span>
                                </div> */}

                                {/* Feedback Sections */}
                                <div className="space-y-4">
                                    <div className="border border-gray-200 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            Positive Feedback
                                        </h3>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {call.positive_feedback || 'No positive feedback recorded'}
                                        </p>
                                    </div>

                                    <div className="border border-gray-200 p-4 rounded-lg">
                                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                            Areas for Improvement
                                        </h3>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {call.improvement_feedback || 'No improvement feedback recorded'}
                                        </p>
                                    </div>
                                </div>

                                {/* Communication Analysis */}
                                <div className="border border-gray-200 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium mb-3">Communication Analysis</h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {call.communication_quality || 'No communication analysis available'}
                                    </p>
                                </div>

                                {/* Call Summary */}
                                <div className="border border-gray-200 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium mb-3">Call Summary</h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {call.conversation_summary || 'No summary available'}
                                    </p>
                                </div>

                                {/* Call Outcome */}
                                <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <h3 className="text-sm font-medium mb-2">Call Outcome</h3>
                                            <div className="flex items-center gap-2">
                                                {call.call_outcome === 'appointment_scheduled' ? (
                                                    <>
                                                        <Calendar className="w-4 h-4 text-black" />
                                                        <span>Appointment Scheduled</span>
                                                    </>
                                                ) : call.call_outcome === 'call_completed' ? (
                                                    <>
                                                        <CheckCircle className="w-4 h-4 text-black" />
                                                        <span>Call Completed</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <MessageCircle className="w-4 h-4 text-black" />
                                                        <span>Follow Up Required</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-600 mb-1">Emotional State</div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${call.emotionalState === 'positive' ? 'bg-green-100 text-green-800' :
                                                    call.emotionalState === 'neutral' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {call.emotional_state || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Metadata */}
                                <div className="border border-gray-200 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium mb-3">Call Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Duration:</span>
                                            <span className="ml-2 text-gray-900">
                                                {call.duration || 'N/A'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Quality:</span>
                                            <span className="ml-2 text-gray-900 capitalize">
                                                {call.communication_quality || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'chat' && (
                            <div className="flex flex-col h-full">
                                {/* Messages Container */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-white/50">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                                        >
                                            <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                                                {/* Avatar */}
                                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user'
                                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 ml-2'
                                                        : 'bg-gradient-to-r from-blue-500 to-purple-600 mr-2'
                                                    }`}>
                                                    {message.type === 'user' ?
                                                        <User className="w-4 h-4 text-white" /> :
                                                        <Bot className="w-4 h-4 text-white" />
                                                    }
                                                </div>

                                                {/* Message Bubble */}
                                                <div className="flex flex-col">
                                                    <div className={`px-4 py-3 rounded-2xl shadow-lg ${message.type === 'user'
                                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-tr-sm'
                                                            : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm'
                                                        }`}>
                                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                            {message.content}
                                                        </p>
                                                    </div>
                                                    <div className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'
                                                        }`}>
                                                        {formatTime(message.timestamp)}
                                                    </div>
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
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="border-t border-gray-200 bg-white p-4">
                                    <div className="flex items-end space-x-3">
                                        <div className="flex-1 relative">
                                            <textarea
                                                ref={inputRef}
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Type your message here..."
                                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32 transition-all duration-200 bg-gray-50 hover:bg-white"
                                                rows={1}
                                                style={{ minHeight: '48px' }}
                                                disabled={isLoading}
                                            />
                                            <div className="absolute right-3 bottom-3">
                                                <button
                                                    onClick={sendMessage}
                                                    disabled={!inputValue.trim() || isLoading}
                                                    className={`p-2 rounded-full transition-all duration-200 ${inputValue.trim() && !isLoading
                                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {isLoading ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Send className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default CallDetailsSheet;


{/* Header */ }
{/* <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-sm text-gray-500">
              {isTyping ? 'Typing...' : isLoading ? 'Thinking...' : 'Online'}
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          title="Clear conversation"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div> */}