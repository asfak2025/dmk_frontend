// import React from 'react';
// import { Button } from '@/components/ui/button';
// import Link from 'next/link';
// import Image from 'next/image';
// import { MotionDiv } from '../ui/motion-div';

// // Mock MotionDiv component (since framer-motion isn't available)

// export default function HeroSection() {
//   return (
//     <section className="w-full py-12 flex items-center justify-center bg-white ">
//         <div className="container px-4 md:px-6">
//           <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
//             <div className="flex flex-col justify-center space-y-4">
//               <div className="space-y-2">
//                 <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
//                   AI Agents with Telephonic Interface & Agentic Workflows
//                 </h1>
//                 <p className="max-w-[600px] text-muted-foreground md:text-xl">
//                   Build and deploy AI agents powered by telephonic interactions and advanced agentic workflows like React Flow or n8n-style flows.
//                 </p>
//               </div>
//               <div className="flex flex-col gap-2 min-[400px]:flex-row">
//                 <Button asChild size="lg">
//                   <Link href="/login">Get Started</Link>
//                 </Button>
//                 <Button variant="outline" size="lg">
//                   <Link href="/waitlist">Join Waitlist</Link>
//                 </Button>
//               </div>
//             </div>
//             <div className="flex items-center justify-center">
//               <MotionDiv
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="relative w-full h-[200px] md:h-[300px] lg:h-[400px]"
//               >
//                 <Image
//                   src="/images/renvoice.png"
//                   alt="AI Agent Dashboard"
//                   fill
//                   className="object-contain"
//                   priority
//                 />
//               </MotionDiv>
//             </div>
//           </div>
//         </div>
//       </section>
//             );
//           }

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { MotionDiv } from "../ui/motion-div";
import Modal from "@/components/Modal/modal";
import { useAppContext } from "@/hooks/context";
import { VideoModal } from "../Modal/video-model";
import { X, User, Phone, Mail, Building, MessageSquare, Send, Calendar } from 'lucide-react';
import Alert from "@/components/alert/alert";
import { useAlert } from "@/hooks/alertHook";
import { m } from "framer-motion";
import { debounceApiCall } from "@/lib/debounce";
import TryNow from "./tryNow";
import SDKModal from "../Modal/sdkModal";




// Floating elements component
type InstructionStep = {
  number: number;
  title: string;
  description: string;
};


type AgentInstructions = {
  title: string;
  desc: string;
  ainumber?: number;
  steps: InstructionStep[];
  tips: string[];
}
type AgentsInstructions = Record<string, AgentInstructions>;

const agentsInstructions: AgentsInstructions = {
  "appointmentBooking": {
    "title": "Appointment Booking",
    "ainumber": 35393117,
    "desc": "This agent allows users to easily schedule and manage meetings using an interactive calendar interface.",
    "steps": [
      {
        "number": 1,
        "title": "Initiate Call",
        "description": "Choose the type of appointment — meeting, interview, or something else."
      },
      {
        "number": 2,
        "title": "State Your Request",
        "description": "Check open time slots and choose one that works for you."
      },
      {
        "number": 3,
        "title": "Provide Details",
        "description": "Just your name, contact, and what the appointment is about."
      },
      {
        "number": 4,
        "title": "Book It!",
        "description": "Confirm the details and you’re all set. You’ll get a message with the booking info."
      }
    ],
    "tips": [
      "Have your calendar ready to check availability",
      "Know the type of appointment you need beforehand",
      "Speak clearly when providing dates and times"
    ]
  },
  "aiFriend": {
    "title": "AI Friend ",
    "ainumber": 35393117,
    "desc": "This agent is your friendly, always-available AI companion that you can talk to just like a close friend over a phone call. ",
    "steps": [
      {
        "number": 1,
        "title": "Initiate Call",
        "description": "Dial your AI Bestie anytime — no booking, no wait. It’s like calling a close friend."
      },
      {
        "number": 2,
        "title": "Start Chatting",
        "description": "Say “Hey!” or jump right into anything on your mind — your day, a joke, or even random thoughts."
      },
      {
        "number": 3,
        "title": "Engage Naturally",
        "description": "Your Bestie listens, gets your vibe, and chats back like a real friend — fun, caring, and natural."
      },
      {
        "number": 4,
        "title": "Explore Topics",
        "description": "Switch topics anytime, ask for advice, or just vent. Whatever’s on your mind, your Bestie’s here."
      }
    ],
    "tips": [
      "Treat it like talking to a real friend",
      "Don't hesitate to share your thoughts",
      "You can discuss hobbies, feelings, or daily experiences"
    ]
  },
  "leadGeneration": {
    "title": "Lead Generation",
    "ainumber": 35393119,
    "desc": "This Agent helps users to generate qualified leads by making the property discovery process easy, fast, and conversational.",
    "steps": [
      {
        "number": 1,
        "title": "Initiate Call",
        "description": "Call the AI Agent number — you'll be greeted and asked what type of land you’re looking for: residential, commercial, or agricultural."
      },
      {
        "number": 2,
        "title": "Provide Criteria",
        "description": "Quickly share your preferred location, budget, and plot purpose (like home, farming, or business)."
      },
      {
        "number": 3,
        "title": "Review Suggestions",
        "description": "The agent suggests suitable plots with details like price, size, approvals, and nearby landmarks."
      },
      {
        "number": 4,
        "title": "Request Details",
        "description": "If you're interested, just share your name, number, and a good time to chat. A real estate expert will follow up with you."
      }
    ],
    "tips": [
      "Have your target customer profile ready",
      "Be specific about your ideal lead characteristics",
      "Ask for email addresses or direct phone numbers if needed"
    ]
  },
  "conversationalRAG": {
    "title": "Conversational RAG",
    "ainumber": 35393117,
    "desc": "This Agent is designed to answer company-related queries in real time. It is ideal for customer support, internal helpdesks, HR queries, etc. by feeding Company documents, FAQs, policies, and internal knowledge bases into the agent.",
    "steps": [
      {
        "number": 1,
        "title": "Initiate Call",
        "description": "Dial the AI support number — the agent will greet you and is ready to help with anything company-related."
      },
      {
        "number": 2,
        "title": "Ask Questions",
        "description": "Whether it’s about services, policies, or departments like HR or support, just ask in your own words."
      },
      {
        "number": 3,
        "title": "Receive Answers",
        "description": "The agent pulls info from the company’s official knowledge base to give accurate, real-time responses."
      },
      {
        "number": 4,
        "title": "Follow Up",
        "description": "Need more details? Ask follow-ups like “Can you give an example?” — the AI will continue helping just like a real agent."
      }
    ],
    "tips": [
      "Questions can be about current events or specialized knowledge",
      "The AI can provide sources for its information",
      "Complex questions may be broken into multiple responses"
    ]
  },
  "surveyFeedback": {
    "title": "Survey/Feedback Instructions",
    "ainumber": 35393117,
    "desc": "This Agent calls customers after a purchase or delivery to collect feedback. It conducts a conversational survey, asking questions related to the user’s shopping experience.",
    "steps": [
      {
        "number": 1,
        "title": "Initiate Call",
        "description": "After your product is delivered, the AI agent calls you to ask for quick feedback."
      },
      {
        "number": 2,
        "title": "Answer Questions",
        "description": "It asks easy questions like your satisfaction rating or if the delivery was on time — just speak naturally."
      },
      {
        "number": 3,
        "title": "Provide Details",
        "description": "If there’s a problem, the agent asks follow-up questions so you can explain what went wrong."
      },
      {
        "number": 4,
        "title": "Complete Survey",
        "description": "Once done, it thanks you for your feedback and ends the call politely."
      }
    ],
    "tips": [
      "Have your experiences fresh in mind",
      "Be specific in your feedback",
      "Honest criticism is welcome and helpful"
    ]
  },
  // Job Screening Agent Name Changed to Personal Assistants
  "personalAssistants": {
    "title": "Personal Assistant",
    "ainumber": 35393118,
    "desc": "This Agent is designed to pre-screen job candidates. It helps recruiters and companies save time, filter applicants, and collect structured responses before a human interview.",
    "steps": [
      {
        "number": 1,
        "title": "Initiate Call",
        "description": "The AI calls the candidate and explains it will ask a few questions to assess fit for a job role."
      },
      {
        "number": 2,
        "title": "Answer Questions",
        "description": "It asks about the candidate’s background, skills, and experience — responses are analyzed for clarity and relevance."
      },
      {
        "number": 3,
        "title": "Provide Examples",
        "description": "The AI may ask for examples, like past projects, to understand practical experience with key skills."
      },
      {
        "number": 4,
        "title": "Complete Screening",
        "description": "After the questions, the AI ends the call and lets the candidate know that their responses will be shared with the hiring team."
      }
    ],
    "tips": [
      "Have your resume handy for reference",
      "Speak professionally and clearly",
      "Prepare for common interview questions"
    ]
  },
  "leadGenerationOt": {
    "title": "Lead Generation",
    "ainumber": 35393119,
    "desc": "This Agent helps users to generate qualified leads by making the property discovery process easy, fast, and conversational",
    "steps": [
      {
        "number": 1,
        "title": "Initiate Call",
        "description": "The AI calls you and asks what kind of land you’re looking for — residential, commercial, or agricultural."
      },
      {
        "number": 2,
        "title": "Provide Criteria",
        "description": "You’ll answer a few simple questions about your preferred location, budget, and purpose of the land."
      },
      {
        "number": 3,
        "title": "Review Suggestions",
        "description": "Based on your answers, the agent suggests suitable plots with price ranges and key highlights."
      },
      {
        "number": 4,
        "title": "Request Details",
        "description": "If you’re interested, the agent collects your name and contact info and passes it to a real estate expert for follow-up."
      }
    ],
    "tips": [
      "Have your target customer profile ready",
      "Be specific about your ideal lead characteristics",
      "Ask for email addresses or direct phone numbers if needed"
    ]
  },
  "employeeSupport": {
    "title": "Employee Support",
    "ainumber": 35393112,
    "desc": "This Agent is designed to provide instant HR helpdesk and workplace support to employees. Whether it's related to leaves, payroll, or technical issues",
    "steps": [
      {
        "number": 1,
        "title": "Initiate Call",
        "description": "The agent greets you and asks how it can help with HR-related matters like leave, payroll, or tech support."
      },
      {
        "number": 2,
        "title": "State Your Issue",
        "description": "Just explain what you need — like applying for leave or reporting a salary issue. The AI understands common workplace topics."
      },
      {
        "number": 3,
        "title": "Follow Guidance",
        "description": "The agent will either give you an immediate answer or guide you through the next steps to resolve the issue."
      },
      {
        "number": 4,
        "title": "Request Escalation",
        "description": "For complex or sensitive cases, the AI can notify HR or connect you with a human for follow-up."
      }
    ],
    "tips": [
      "Have relevant details ready (dates, names, policy numbers)",
      "Be clear about what resolution you're seeking",
      "The AI can provide policy documents if needed"
    ]
  },
  "personalAssistant": {
    "title": "Personal Assistant",
    "ainumber": 18273645,
    "desc": "This Assistant acts like a smart friend who’s always available. You can talk casually, ask about your day, get help with tasks, or just chat to clear your mind.",
    "steps": [
      {
        "number": 1,
        "title": "Say Hello",
        "description": "Start by greeting the assistant. It replies warmly and sets the tone for a relaxed conversation."
      },
      {
        "number": 2,
        "title": "Share Your Thoughts",
        "description": "Talk about anything how you feel, your plans, or questions you have. The assistant listens and responds like a friend would."
      },
      {
        "number": 3,
        "title": "Get Help",
        "description": "Need reminders, ideas, or information? The assistant helps you organize, suggest, or look things up quickly."
      },
      {
        "number": 4,
        "title": "Continue the Chat",
        "description": "Ask follow-up questions, change topics, or just keep chatting. The assistant is always ready to keep the conversation going."
      }
    ],
    "tips": [
      "Talk like you would to a friend no need to be formal",
      "Ask for advice when you're unsure or stuck",
      "Use it to plan your day or talk through decisions",
    ]
  },
  "webSearch": {
    "title": "Web Search",
    "ainumber": 35393117,
    "desc": "This Agent is your smart voice assistant that helps you find information instantly such as current news, local business details, weather updates, or answers to specific questions.",
    "steps": [
      {
        "number": 1,
        "title": "Initiate Call",
        "description": "The AI welcomes you and lets you know it’s ready to help with any web search."
      },
      {
        "number": 2,
        "title": "State Your Query",
        "description": "Ask about facts, news, prices, places, events — anything you’d usually Google."
      },
      {
        "number": 3,
        "title": "Receive Results",
        "description": "The AI searches the web and gives a clear, summarized response from reliable sources."
      },
      {
        "number": 4,
        "title": "Refine Search",
        "description": "Need more info? Just ask follow-ups — the conversation flows naturally without starting over."
      }
    ],
    "tips": [
      "Be as specific as possible with your query",
      "You can ask for sources or links to be emailed",
      "The AI can summarize lengthy information"
    ]
  },
  "translator": {
    "title": "Translator",
    "ainumber": 35393117,
    "desc": "This Agent is your smart voice assistant that helps you translate between multiple languages like regional languages and international languages, making it ideal for personal use, businesses, or customer service.",
    "steps": [
      {
        "number": 1,
        "title": "Initiate Call",
        "description": "The AI greets you and asks which languages you want to translate between."
      },
      {
        "number": 2,
        "title": "Specify Languages",
        "description": "Just say, for example, “English to Tamil” or “Tamil to Hindi” — the AI will confirm and get ready."
      },
      {
        "number": 3,
        "title": "Speak or Spell",
        "description": "Speak a word or sentence clearly. You can spell it out if needed."
      },
      {
        "number": 4,
        "title": "Receive Translation",
        "description": "The AI speaks the correct translation clearly. You can ask for more or keep translating different phrases."
      }
    ],
    "tips": [
      "For accuracy, spell out uncommon words or names",
      "You can ask for the translation to be repeated slowly",
      "The AI can translate in both directions"
    ]
  },
  "carIntelligence": {
    "title": "Car Intelligence",
    "ainumber": 35393117,
    "desc": "This Agent is your virtual car assistant, available 24/7. It helps users diagnose car issues, answer vehicle-related questions, travel-related questions",
    "steps": [
      {
        "number": 1,
        "title": "Initiate Call",
        "description": "The Car Intelligence AI welcomes you and is ready to help with any car-related question or issue."
      },
      {
        "number": 2,
        "title": "Describe Issue",
        "description": "Just describe your issue or ask anything — like warning lights, travel time, or strange noises."
      },
      {
        "number": 3,
        "title": "Answer Questions",
        "description": "The AI might ask for more details to understand the problem better — like your location or symptoms."
      },
      {
        "number": 4,
        "title": "Receive Guidance",
        "description": "It then suggests what to do next or gives you the exact info you need, right away."
      }
    ],
    "tips": [
      "Have your car's make, model, and year ready",
      "Describe symptoms precisely (sounds, warning lights)",
      "The AI can suggest nearby repair shops if needed"
    ]
  }
}
const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      <div className="absolute top-20 left-10 w-20 h-20 bg-gray-500/10 rounded-full animate-float-slow"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-slat-500/10 rounded-full animate-float-medium"></div>
      <div className="absolute bottom-32 left-20 w-12 h-12 bg-slat-500/10 rounded-full animate-float-fast"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-gray-500/10 rounded-full animate-float-slow"></div>
    </div>
  );
};

// Gradient orbs
const GradientOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-slate-400/20 to-gray-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-gray-400/20 to-slate-600/20 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      ></div>
    </div>
  );
};

// Typewriter effect hook
const useTypewriter = (text, speed = 50) => {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
};
type openType = {
  show: boolean,
  callType: string
}

export default function HeroSection() {
  const{URL,IMAGE_URL,setVideoModel,videoModel}=useAppContext();
  const [videoOpen, setVideoOpen] = useState(false);
  const [open, setOpen] = useState<openType>({
          show: false,
          callType: "Incoming"
        })
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeInstruction, setActiveInstruction] = useState<any>(null);
  const handleInstructionClose = () => {
        setOpen({ show: false, callType: "" })
        setActiveModal(null);
        setActiveInstruction(null);
      };

  const handleInstructionOpen = () => {
    console.log("CALLTYPE", "Incoming")
    setOpen({ show: true, callType: "Incoming" })
    setActiveModal("personalAssistants");
    console.log(agentsInstructions["personalAssistants"], "instruction")
    setActiveInstruction(agentsInstructions["personalAssistants" as keyof typeof agentsInstructions]);
  };
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNo: '',
    businessEmail: '',
    company: '',
    whatLookingFor: '',
    comment: ''
  });
  type FormErrors = {
    fullName?: string;
    phoneNo?: string;
    businessEmail?: string;
    company?: string;
    whatLookingFor?: string;
    comment?: string;
  };
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const handleVideoOpen = () => {
    console.log("Opening video modal",videoModel);
    setVideoModel(true)
  };

  const handleVideoClose = () => {
   setVideoModel(false)
  };
  const { displayText: titleText, isComplete } = useTypewriter(
    "Voice AI Agents with Telephonic Interface & SDK Integration",
    50
  );

    // Validation patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'fullName':
        if (!value || value.trim() === '') {
          error = 'Full name is required';
        }
        break;
      case 'phoneNo':
        if (!value || value.trim() === '') {
          error = 'Phone number is required';
        } else if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
          error = 'Please enter a valid phone number';
        }
        break;
      case 'businessEmail':
        if (!value || value.trim() === '') {
          error = 'Business email is required';
        } else if (!emailRegex.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'company':
        if (!value || value.trim() === '') {
          error = 'Company name is required';
        }
        break;
      case 'whatLookingFor':
        if (!value || value.trim() === '') {
          error = 'This field is required';
        } else if (value.trim().length < 5) {
          error = 'Minimum 5 characters required';
        }
        break;
      case 'comment':
        if (!value || value.trim() === '') {
          error = 'Comment is required';
        } else if (value.trim().length < 5) {
          error = 'Minimum 5 characters required';
        }
        break;
      default:
        break;
    }

    return error;
  };

   const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    return newErrors;
  };

  const isFormValid = () => {
    const validationErrors = validateForm();
    return Object.keys(validationErrors).length === 0 && 
           Object.values(formData).every(value => value && value.trim() !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    console.log('Submitting form with data:', formData);
    
    try {
      const res = await fetch(`${URL}/contact/contact-detail`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

        const data = await res.json();
        if (res.status === 200) {
          showAlert( data.message || "Form submitted successfully", "success");
          setShowModal(false);
          setFormData({
            fullName: '', 
            phoneNo: '',
            businessEmail: '',
            company: '',
            whatLookingFor: '',
            comment: ''
          });
          setErrors({});

      } else {
        showAlert(data.message || "Failed to submit form", "error");
      }
    } catch (error) {
      console.log(error);
      showAlert(error.message || "Error submitting form", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setErrors({});
  };

  const debounce = debounceApiCall(handleSubmit, 1000);
//  useEffect(()=>{
//   console.log(open)
//  },[open])

  return (
    <>
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(120deg);
          }
        }

        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(90deg);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-gradient {
          background: linear-gradient(
            -45deg,
            #667eea,
            #764ba2,
            #f093fb,
            #f5576c
          );
          background-size: 400% 400%;
          animation: gradient-shift 8s ease infinite;
        }

        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }

        .shimmer-effect::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: shimmer 2s infinite;
        }

        .glass-morphism {
          backdrop-filter: blur(16px) saturate(180%);
          background-color: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.125);
        }

        .text-gradient {
          background: linear-gradient(135deg, #475569 0%, #1e293b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <section className="relative min-h-[80vh] xl:min-h-fit w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-slat-100 overflow-hidden ">
        {/* Background Elements */}
        {/* <GradientOrbs /> */}
        {/* <FloatingElements /> */}

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%222%22%20fill%3D%22%23e2e8f0%22%20/%3E%3C/svg%3E')] opacity-30"></div>

        <div className="container relative z-10 px-4 md:px-6 mx-auto">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-20 items-center">
            {/* Content Section */}
            <div className="flex flex-col justify-center space-y-8">
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm bg-white/50 backdrop-blur-sm border-blue-200 text-gray-800 mb-6">
                 
                 
                </div> */}
                <span className="w-2 h-2 bg-slat-500 rounded-full mr-2 animate-pulse"></span>
              </MotionDiv>
              <div className="flex items-center justify-center md:hidden">
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-[200px] md:h-[300px] lg:h-[400px]"
                >
                  <Image
                    src={`${IMAGE_URL}/renvoice_banner.jpeg`}
                    alt="AI Agent Dashboard"
                    fill
                    className="object-contain "
                    priority
                  />
                </MotionDiv>
              </div>
              
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <div className="flex flex-wrap gap-8 pt-4 pb-4 border-b border-slate-200 justify-center md:hidden">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      99.9%
                    </div>
                    <div className="text-sm text-slate-600">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                    &lt;1s
                    </div>
                    <div className="text-sm text-slate-600">Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      24/7
                    </div>
                    <div className="text-sm text-slate-600">AI Support</div>
                  </div>
                </div>
              </MotionDiv>
              
              <div className="space-y-6">
                <MotionDiv
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h1 className="text-2xl font-bold sm:text-4xl xl:text-[2.7rem] leading-tight">
                    <span className=" text-black leading-tight">{titleText}</span>
                    {!isComplete && (
                      <span className="inline-block w-1 h-8 bg-gray-600 ml-2 animate-pulse"></span>
                    )}
                  </h1>
                </MotionDiv>

                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <p className="max-w-[600px] text-slate-800 text-lg md:text-xl leading-relaxed">
                    {/* Build and deploy AI agents powered by{" "}
                    <span className="font-semibold text-blue-600">
                      telephonic interactions
                    </span>{" "}
                    and advanced agentic workflows like React Flow or n8n-style
                    flows.  */}
                    Build and deploy Voice agents powered by
                   {" "}<span className="font-semibold text-blue-600">
                      custom LLM / voice models
                    </span>{" "}
                    with advanced agentic workflows like Zapier / N8N
                     for seamless voice-based automation. Supports on-premise deployments for enterprises.
                  </p>
                </MotionDiv>
              </div>

              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="flex flex-col sm:flex-row gap-4 pt-4 ">
                  {/* <Button
                    asChild
                  
                    className="hover-lift bg-black hover:bg-slate-700 text-white p-6  text-lg font-semibold rounded-xl shadow-lg shimmer-effect"
                  >
                    <Link href="/signUp" className="flex items-center gap-2">
                      Get Started Free
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  </Button> */}
                  <Button
                    onClick={handleInstructionOpen}
                    className="hover-lift bg-black  text-white p-6 text-lg font-semibold rounded-xl shadow-lg shimmer-effect"
                  >
                    <div className="flex items-center gap-2">
                      Try Now
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </Button>
                  <Button
                    onClick={() => window.open( 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3hp6fxKIeJKgQ9MvJqwkxlDwGXnHiaEoURxkeLMSKVHMIowA-nONN7rZHVQTTYP3fLv4orJLn2',"_blank")}
                    className="hover-lift bg-black  text-white p-6 text-lg font-semibold rounded-xl shadow-lg shimmer-effect"
                  >
                    <div className="flex items-center gap-2">
                      Book An Appoinment 
                      <Calendar/>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      > 
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </Button>
                  
                 <SDKModal
        open={open.show && open.callType !== 'SDK'}
        onClose={handleInstructionClose}
        title={activeInstruction?.title || "Instructions"}
        description={activeInstruction?.desc || "Step-by-step guide for using this agent"}
      > <TryNow open={open} activeInstruction={activeInstruction} activeModal={activeModal} onClose={handleInstructionClose} />  
      </SDKModal>
                  
                 
                  {/* <Modal 
                    open={showModal} 
                    onClose={handleModalClose}
                    title="Get Started with Renvoice"
                    description="Fill in your details to begin"
                  >
                    <div className="w-[85vw] h-[60vh] md:w-[70vw] md:h-[60vh] lg:w-[60vw] max-w-5xl mt-5 ">
                      <form onSubmit={debounce} className="grid grid-cols-1 md:grid-cols-2 gap-6 "> */}
                        
                        {/* Full Name */}
                        {/* <div className="col-span-1">
                          <label className="block text-black font-medium mb-2">Full Name *</label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className="w-full px-4 py-3 bg-white border border-black rounded-lg text-black placeholder-gray-500 focus:outline-none "
                            placeholder="Enter your full name"
                          />
                          {errors.fullName && (
                            <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
                          )}
                        </div> */}

                        {/* Phone Number */}
                        {/* <div className="col-span-1">
                          <label className="block text-black font-medium mb-2">Phone Number *</label>
                          <input
                            type="tel"
                            name="phoneNo"
                            value={formData.phoneNo}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            maxLength={10}
                            pattern="[0-9]*"
                            inputMode="numeric"
                            className="w-full px-4 py-3 bg-white border border-black rounded-lg text-black placeholder-gray-500 focus:outline-none "
                            placeholder="Enter your phone number"
                            max={10}
                          />
                          {errors.phoneNo && (
                            <p className="text-red-400 text-sm mt-1">{errors.phoneNo}</p>
                          )}
                        </div> */}

                        {/* Business Email */}
                        {/* <div className="col-span-1">
                          <label className="block text-black font-medium mb-2">Business Email *</label>
                          <input
                            type="email"
                            name="businessEmail"
                            value={formData.businessEmail}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className="w-full px-4 py-3 bg-white border border-black rounded-lg text-black placeholder-gray-500 focus:outline-none "
                            placeholder="Enter your business email"
                          />
                          {errors.businessEmail && (
                            <p className="text-red-400 text-sm mt-1">{errors.businessEmail}</p>
                          )}
                        </div> */}

                        {/* Company */}
                        {/* <div className="col-span-1">
                          <label className="block text-black font-medium mb-2">Company *</label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className="w-full px-4 py-3 bg-white border border-black rounded-lg text-black placeholder-gray-500 focus:outline-none "
                            placeholder="Enter your company name"
                          />
                          {errors.company && (
                            <p className="text-red-400 text-sm mt-1">{errors.company}</p>
                          )}
                        </div> */}

                        {/* What Looking For (full width) */}
                        {/* <div className="col-span-1 md:col-span-2">
                          <label className="block text-black font-medium mb-2">What are you looking for? *</label>
                          <textarea
                            name="whatLookingFor"
                            value={formData.whatLookingFor}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            rows={3}
                            className="w-full px-4 py-3 bg-white border border-black rounded-lg text-black placeholder-gray-500 focus:outline-none  resize-none"
                            placeholder="Describe what you're looking for"
                          />
                          {errors.whatLookingFor && (
                            <p className="text-red-400 text-sm mt-1">{errors.whatLookingFor}</p>
                          )}
                        </div> */}

                        {/* Comment (full width) */}
                        {/* <div className="col-span-1 md:col-span-2">
                          <label className="block text-black font-medium mb-2">Comment *</label>
                          <textarea
                            name="comment"
                            value={formData.comment}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            rows={3}
                            className="w-full px-4 py-3 bg-white border border-black rounded-lg text-black placeholder-gray-500 focus:outline-none  resize-none"
                            placeholder="Additional comments"
                          />
                          {errors.comment && (
                            <p className="text-red-400 text-sm mt-1">{errors.comment}</p>
                          )}
                        </div>

                      </form> */}
                       {/* Sticky Bottom Submit Bar */}
                      {/* <div className="sticky bottom-0 bg-white border-t pt-4 mt-4 flex justify-end z-10">
                        <Button
                          type="submit"
                          disabled={!isFormValid()}
                          className={`rounded-lg font-medium border transition-all duration-200 ${
                            isFormValid()
                              ? 'bg-black text-white border-black'
                              : 'bg-gray-300 text-gray-600 border-gray-300 cursor-not-allowed'
                          }`}
                          onClick={debounce}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>

                  </Modal> */}
                 
                  {/* <Button
                    asChild
                    variant="outline"
                    className="hover-lift glass-morphism border-2 border-slate-200 p-6 text-lg font-semibold rounded-xl"
                  >
                    <Link
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        handleVideoOpen();
                      }}
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Watch Demo
                    </Link>
                  </Button> */}
                </div>
              </MotionDiv>

              {/* Stats Section */}
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <div className="hidden md:flex flex-wrap gap-8 pt-8 border-t border-slate-200 ">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      99.9%
                    </div>
                    <div className="text-sm text-slate-600">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                    &lt;1s
                    </div>
                    <div className="text-sm text-slate-600">Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      24/7
                    </div>
                    <div className="text-sm text-slate-600">AI Support</div>
                  </div>
                </div>
              </MotionDiv>
            </div>

            {/* Image Section */}
            {/* <div className="flex items-center justify-center lg:justify-end">
              <MotionDiv
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="relative w-full max-w-lg"
              > */}
            {/* Decorative elements around the image */}
            {/* <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div> */}
            {/* <div className="absolute -inset-2 bg-white rounded-2xl shadow-2xl"></div>

                <div className="relative w-full h-[200px] md:h-[300px] lg:h-[400px] ">
                  <Image
                    src="/images/renvoice.png"
                    alt="AI Agent Dashboard"
                    fill
                    className="object-contain bg-red-700"
                    priority
                  />
                </div>
              </MotionDiv>
            </div> */}
            <div className="hidden md:flex items-center justify-center">
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full h-[200px] md:h-[300px] lg:h-[400px]"
              >
                <Image
                  src={`${IMAGE_URL}/renvoice_banner.jpeg`}
                  alt="AI Agent Dashboard"
                  fill
                  className="object-contain "
                  priority
                />
              </MotionDiv>
            </div>
          </div>
        </div>
         {alert && <Alert alert={alert} hideAlert={hideAlert} />}
      </section>
    </>
  );
}
