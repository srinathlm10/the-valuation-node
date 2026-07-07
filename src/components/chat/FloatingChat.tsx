import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import { ChatSidebar } from "./ChatSidebar";

interface FloatingChatProps {
  context?: string;
  initialMessage?: string;
}

export function FloatingChat({ context, initialMessage }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button, bottom-right, always visible */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open assistant"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      <ChatSidebar
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        initialMessage={initialMessage}
        context={context}
      />
    </>
  );
}
