import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, X, Send, Loader2, Plus, Trash2, History, Mic, MicOff, Volume2, VolumeX, Paperclip, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { chatService, ChatSession, ChatMessage } from "@/services/chatService";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  initialMessage?: string;
  context?: string;
}

export function ChatSidebar({ isOpen, onToggle, initialMessage, context }: ChatSidebarProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis>(window.speechSynthesis);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN'; // Indian English

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSendMessage(transcript); // Auto-send on voice end
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }
  }, []);

  // Initialize TTS Cleanup
  useEffect(() => {
    return () => {
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  // Load Sessions on Mount
  useEffect(() => {
    if (user && isOpen) {
      loadSessions();
    }
  }, [user, isOpen]);

  // Load Messages when Session Changes
  useEffect(() => {
    if (currentSessionId) {
      loadMessages(currentSessionId);
    } else {
      setMessages([{
        id: "welcome",
        session_id: "temp",
        role: "assistant",
        content: "Hello! I'm **FinBot**, your financial knowledge assistant. I can help you with Indian markets, SEBI regulations, and more. Start a new chat!"
      } as ChatMessage]);
    }
  }, [currentSessionId]);

  // Handle Initial Message (Contextual)
  useEffect(() => {
    if (initialMessage && isOpen && !currentSessionId) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage, isOpen]);

  const loadSessions = async () => {
    try {
      const data = await chatService.getSessions();
      setSessions(data);
    } catch (error) {
      console.error("Failed to load sessions", error);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      setIsLoading(true);
      const data = await chatService.getMessages(sessionId);
      setMessages(data);
    } catch (error) {
      console.error("Failed to load messages", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSession = async () => {
    setCurrentSessionId(null);
    setShowHistory(false);
    setMessages([{
      id: "welcome",
      session_id: "temp",
      role: "assistant",
      content: "Hello! I'm **FinBot**, your financial knowledge assistant. I can help you with Indian markets, SEBI regulations, and more. Start a new chat!"
    } as ChatMessage]);
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    try {
      await chatService.deleteSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        createNewSession();
      }
    } catch (error) {
      console.error("Failed to delete session", error);
    }
  }

  // Voice Functions
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const speakText = (text: string) => {
    if (synthesisRef.current.speaking) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown chars for better speech
    const cleanText = text.replace(/[*#`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-IN'; // Indian accent if available

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    synthesisRef.current.speak(utterance);
  };

  // File Upload Functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (Basic validation)
    const validTypes = ['text/plain', 'text/csv', 'application/json', 'text/markdown'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.txt') && !file.name.endsWith('.csv') && !file.name.endsWith('.json') && !file.name.endsWith('.md')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a .txt, .csv, .json, or .md file. PDF support coming soon!",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setFileContent(text);
      toast({
        title: "File Ready",
        description: `Analyzing ${file.name}... Ask a question about it!`,
      });
    };
    reader.readAsText(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFileContent(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || input.trim();
    if ((!content && !fileContent) || isLoading) return;

    // Prepare message (include file info if present)
    let finalContent = content;
    if (selectedFile && fileContent) {
      finalContent = `${content}\n\n[Attached File: ${selectedFile.name}]\n\`\`\`\n${fileContent.slice(0, 5000)}\n\`\`\`\n(File content truncated if too long)`;
    }

    // Optimistic UI Update
    const tempUserMsg: ChatMessage = {
      id: Date.now().toString(),
      session_id: currentSessionId || "temp",
      role: "user",
      content: finalContent,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempUserMsg]);
    setInput("");
    clearFile(); // Clear file after sending
    setIsLoading(true);

    try {
      let sessionId = currentSessionId;

      // 1. Create Session if needed
      if (!sessionId) {
        const newSession = await chatService.createSession(finalContent.slice(0, 30) + "...");
        sessionId = newSession.id;
        setCurrentSessionId(sessionId);
        // Refresh sessions list
        loadSessions();
      }

      // 2. Save User Message
      await chatService.saveMessage(sessionId!, "user", finalContent);

      // 3. Prepare Context for AI
      const conversationHistory = messages
        .filter(m => m.id !== "welcome")
        .map(m => ({ role: m.role, content: m.content }));

      conversationHistory.push({ role: "user", content: finalContent });

      const systemPrompt = context
        ? `You are FinBot, an expert financial assistant for the Indian market.Context for this conversation: \n${context} `
        : `You are FinBot, an expert financial assistant for the Indian market. If the user uploads a file/portfolio, analyze it and give insights.`;

      // 4. Call Cloud Function
      const response = await supabase.functions.invoke("chat", {
        body: { messages: conversationHistory, systemPrompt },
      });

      if (response.error) throw response.error;

      const assistantMessageContent = response.data?.message || "Sorry, I couldn't process that.";

      // 5. Save AI Message
      const savedAiMsg = await chatService.saveMessage(sessionId!, "assistant", assistantMessageContent);

      setMessages(prev => [...prev, savedAiMsg]);

      // 6. Speak the response (optional auto-speak could be added here, but maybe user preferred manual click)
      // speakText(assistantMessageContent); 

    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        session_id: currentSessionId || "temp",
        role: "assistant",
        content: "I'm having trouble connecting. Please try again.",
        created_at: new Date().toISOString()
      } as ChatMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg gradient-slate hover:opacity-90 z-50 transition-transform hover:scale-105"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-background border-l shadow-2xl z-50 flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-primary text-primary-foreground shadow-sm">
        <div className="flex items-center gap-2">
          {showHistory ? (
            <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)} className="text-primary-foreground hover:bg-white/10 -ml-2">
              <X className="h-5 w-5" />
            </Button>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <Bot className="h-5 w-5" />
            </div>
          )}

          <div className="flex flex-col">
            <h3 className="font-semibold text-sm leading-none mb-1">
              {showHistory ? "Chat History" : "FinBot"}
            </h3>
            <span className="text-[10px] opacity-80 font-light">
              {showHistory ? `${sessions.length} saved sessions` : "AI Financial Assistant"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-white/10"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-white/10"
            onClick={createNewSession}
          >
            <Plus className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-white/10"
            onClick={onToggle}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {showHistory ? (
        <ScrollArea className="flex-1 bg-muted/10">
          <div className="p-4 space-y-2">
            {sessions.length === 0 && (
              <div className="text-center text-muted-foreground py-10">
                <History className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p>No chat history found.</p>
              </div>
            )}
            {sessions.map(session => (
              <div
                key={session.id}
                className={cn(
                  "group flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors",
                  currentSessionId === session.id && "border-primary bg-primary/5"
                )}
                onClick={() => {
                  setCurrentSessionId(session.id);
                  setShowHistory(false);
                }}
              >
                <div className="flex flex-col gap-1 overflow-hidden">
                  <span className="text-sm font-medium truncate">{session.title}</span>
                  <span className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(session.updated_at))} ago</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                  onClick={(e) => handleDeleteSession(e, session.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <>
          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn("flex flex-col gap-1 max-w-[85%]", message.role === "user" ? "items-end" : "items-start")}>
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 text-sm shadow-sm",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted rounded-bl-none"
                      )}
                    >
                      {message.role === "assistant" ? (
                        <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        message.content
                      )}
                    </div>
                    {message.role === "assistant" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-primary transition-opacity opacity-0 group-hover:opacity-100 self-start"
                        onClick={() => speakText(message.content)}
                      >
                        {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Analysing...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* File Upload Preview */}
          {selectedFile && (
            <div className="px-4 py-2 bg-muted/30 border-t flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-primary">
                <FileText className="h-4 w-4" />
                <span className="font-medium max-w-[200px] truncate">{selectedFile.name}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={clearFile}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-end gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
                accept=".txt,.csv,.json,.md"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-full shrink-0"
                onClick={() => fileInputRef.current?.click()}
                title="Upload File"
              >
                <Paperclip className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-11 w-11 rounded-full shrink-0 transition-all",
                  isListening && "bg-red-500 text-white border-red-500 animate-pulse hover:bg-red-600 hover:text-white"
                )}
                onClick={toggleListening}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                placeholder={isListening ? "Listening..." : "Ask FinBot..."}
                className="flex-1 min-h-[44px]"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={(!input.trim() && !fileContent) || isLoading}
                size="icon"
                className="h-11 w-11 rounded-full shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
