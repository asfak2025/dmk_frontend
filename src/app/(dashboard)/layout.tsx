"use client";

import ChatModal from "@/components/tickets/chatModal";
import { ModalChat } from "@/components/tickets/Modal";

import { Header } from "@/components/ui/header";

import Sidebar from "@/components/ui/sidebarComponent";
import { useAppContext } from "@/hooks/context";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chatOpen, setChatOpen] = useState(false)
  // const {chatOpen,setChatOpen} = useAppContext();
  // const toggleWidget = () => setChatOpen(!chatOpen);
  // const {ticketId,setTicketId} = useAppContext()


  return (
    // <>
    //   <div className="flex h-auto w-full ">
    //     {/* <Header /> */}
    //     <Sidebar />
    //     <div className=" h-auto w-full ">
    //       <main className="p-4 md:p-6 h-auto w-full ">
    //         {children}
    //       </main>
    //       <div className="fixed bottom-0 right-0 p-4">
    //         <img
    //           className="w-[80px] h-[100px] animate-bounce "
    //           src="/chatbot_image.png"
    //           alt="robot"
    //           onClick={() => setChatOpen(true)}
    //         />
    //       </div>
    //     </div>
    //   </div>
    //   <ModalChat isOpen={chatOpen} onClose={() => setChatOpen(false)} showCloseButton={false}>

    //     <ChatModal onClose={() => { setChatOpen(false) }}>

    //     </ChatModal>
    //   </ModalChat>

    // </>
<>
  <div className="flex h-auto w-full">
    {/* <Header /> */}
    <Sidebar />
    <div className="h-auto w-full">
      <main className="p-4 md:p-6 h-auto w-full">
        {children}
      </main>
      
      {/* <div className="fixed bottom-5 right-5 z-50">
        <div
          className="group relative transition-all duration-100 transform hover:scale-105 cursor-pointer animate-bounce-slow flex items-center justify-center"
          onClick={() => setChatOpen(true)}
        >
          <img
            className="w-[55px] h-[80px] object-contain"
            src="/chat-bot.png"
            alt="Get help"
          />
          
          <div className="absolute top-2 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
            !
          </div>
        </div>
      </div> */}
    </div>
  </div>

  <ModalChat isOpen={chatOpen} onClose={() => setChatOpen(false)} showCloseButton={false}>
    <ChatModal onClose={() => setChatOpen(false)} />
  </ModalChat>

  <style jsx>{`
    @keyframes bounce-slow {
      0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0, 0, 0);
      }
      40%, 43% {
        transform: translate3d(0, -15px, 0);
      }
      70% {
        transform: translate3d(0, -8px, 0);
      }
      90% {
        transform: translate3d(0, -2px, 0);
      }
    }
    
    .animate-bounce-slow {
      animation: bounce-slow 3s infinite;
    }
  `}</style>
</>
  );
}
