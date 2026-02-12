import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, X, Send, Loader2, Plus, Trash2, History, Mic, MicOff, Volume2, VolumeX, Paperclip, FileText, Sparkles } from "lucide-react";
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

      // Only save to database if user is authenticated
      if (user) {
        // 1. Create Session if needed
        if (!sessionId) {
          const newSession = await chatService.createSession(finalContent.slice(0, 30) + "...");
          sessionId = newSession.id;
          setCurrentSessionId(sessionId);
          loadSessions();
        }

        // 2. Save User Message
        await chatService.saveMessage(sessionId!, "user", finalContent);
      }

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

      console.log("Edge Function Response:", response);
      if (response.error) throw new Error(response.error.message || "Failed to get response from AI");

      let assistantMessageContent = response.data?.message;
      if (typeof assistantMessageContent === 'object') {
        console.warn("Received object response from AI:", assistantMessageContent);
        assistantMessageContent = JSON.stringify(assistantMessageContent);
      }
      if (!assistantMessageContent) assistantMessageContent = "Sorry, I couldn't process that.";

      // 5. Save AI Message (only if authenticated)
      if (user && sessionId) {
        const savedAiMsg = await chatService.saveMessage(sessionId!, "assistant", assistantMessageContent);
        setMessages(prev => [...prev, savedAiMsg]);
      } else {
        // Just add to local state without saving
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          session_id: "temp",
          role: "assistant",
          content: assistantMessageContent,
          created_at: new Date().toISOString()
        } as ChatMessage]);
      }

    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        session_id: currentSessionId || "temp",
        role: "assistant",
        content: `I'm having trouble connecting right now. Please try again in a moment.`,
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
      <div className="fixed bottom-6 right-6 z-50 group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse" />
        <Button
          onClick={onToggle}
          className="relative h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-white/20"
          size="icon"
        >
          <Bot className="h-7 w-7 text-white" />
          <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-pulse" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-gradient-to-b from-background via-background to-muted/20 border-l border-border/50 shadow-2xl z-50 flex flex-col animate-slide-in-right backdrop-blur-xl">
      {/* Header */}
      <div className="relative flex items-center justify-between px-5 py-4 border-b border-border/50 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
        <div className="relative flex items-center gap-3 z-10">
          {showHistory ? (
            <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)} className="text-white hover:bg-white/20 -ml-2 transition-all">
              <X className="h-5 w-5" />
            </Button>
          ) : (
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-lg border border-white/30">
              <Bot className="h-6 w-6 text-white" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
            </div>
          )}

          <div className="flex flex-col">
            <h3 className="font-bold text-base leading-none mb-1.5 flex items-center gap-2">
              {showHistory ? "Chat History" : "FinBot"}
              {!showHistory && <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-pulse" />}
            </h3>
            <span className="text-[11px] opacity-90 font-medium">
              {showHistory ? `${sessions.length} saved sessions` : "AI Financial Assistant"}
            </span>
          </div>
        </div>

        <div className="relative flex items-center gap-1.5 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white hover:bg-white/20 rounded-lg transition-all hover:scale-105"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="h-4.5 w-4.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white hover:bg-white/20 rounded-lg transition-all hover:scale-105"
            onClick={createNewSession}
          >
            <Plus className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white hover:bg-white/20 rounded-lg transition-all hover:scale-105"
            onClick={onToggle}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {showHistory ? (
        <ScrollArea className="flex-1 bg-gradient-to-b from-muted/5 to-muted/20">
          <div className="p-5 space-y-3">
            {sessions.length === 0 && (
              <div className="text-center text-muted-foreground py-16">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                  <History className="relative h-16 w-16 mx-auto mb-4 opacity-30" />
                </div>
                <p className="text-sm font-medium">No chat history found.</p>
                <p className="text-xs mt-1 opacity-70">Start a conversation to see it here</p>
              </div>
            )}
            {sessions.map(session => (
              <div
                key={session.id}
                className={cn(
                  "group relative flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-accent/30 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
                  currentSessionId === session.id && "border-primary/50 bg-primary/10 shadow-md ring-2 ring-primary/20"
                )}
                onClick={() => {
                  setCurrentSessionId(session.id);
                  setShowHistory(false);
                }}
              >
                {currentSessionId === session.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-xl" />
                )}
                <div className="relative flex flex-col gap-1.5 overflow-hidden flex-1">
                  <span className="text-sm font-semibold truncate">{session.title}</span>
                  <span className="text-[11px] text-muted-foreground font-medium">{formatDistanceToNow(new Date(session.updated_at))} ago</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-8 w-8 opacity-0 group-hover:opacity-100 transition-all text-destructive hover:bg-destructive/20 rounded-lg"
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
          <ScrollArea className="flex-1 p-5" ref={scrollRef}>
            <div className="space-y-5 pb-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn("group flex flex-col gap-2 max-w-[85%]", message.role === "user" ? "items-end" : "items-start")}>
                    <div
                      className={cn(
                        "rounded-2xl px-5 py-3.5 text-sm shadow-lg transition-all duration-300",
                        message.role === "user"
                          ? "bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-br-none border border-blue-500/20"
                          : "bg-card/80 backdrop-blur-sm rounded-bl-none border border-border/50 hover:shadow-xl"
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
                        className="h-7 w-7 text-muted-foreground hover:text-primary transition-all opacity-0 group-hover:opacity-100 self-start rounded-lg hover:bg-primary/10"
                        onClick={() => speakText(message.content)}
                      >
                        {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="bg-gradient-to-r from-primary/10 to-purple/10 rounded-2xl rounded-bl-none px-5 py-3.5 flex items-center gap-3 border border-primary/20 shadow-lg">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-sm font-medium bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Analysing...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* File Upload Preview */}
          {selectedFile && (
            <div className="mx-4 mb-2 px-4 py-3 bg-gradient-to-r from-primary/10 to-purple/10 border border-primary/30 rounded-xl flex items-center justify-between shadow-md animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 text-sm text-primary">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <FileText className="h-4 w-4" />
                </div>
                <span className="font-semibold max-w-[200px] truncate">{selectedFile.name}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-destructive/20 rounded-lg transition-all" onClick={clearFile}>
                <X className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}

          {/* Input */}
          <div className="p-5 border-t border-border/50 bg-gradient-to-t from-background via-background/95 to-background/90 backdrop-blur-xl">
            <div className="flex items-end gap-2.5">
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
                className="h-12 w-12 rounded-full shrink-0 border-2 hover:bg-primary/10 hover:border-primary/50 transition-all hover:scale-105"
                onClick={() => fileInputRef.current?.click()}
                title="Upload File"
              >
                <Paperclip className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-12 w-12 rounded-full shrink-0 transition-all duration-300 border-2",
                  isListening
                    ? "bg-gradient-to-br from-red-500 to-red-600 text-white border-red-400 animate-pulse hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/50"
                    : "hover:bg-primary/10 hover:border-primary/50 hover:scale-105"
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
                placeholder={isListening ? "🎤 Listening..." : "Ask FinBot anything..."}
                className="flex-1 min-h-[48px] text-base border-2 rounded-2xl px-5 focus-visible:ring-2 focus-visible:ring-primary/50 bg-background/50 backdrop-blur-sm"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={(!input.trim() && !fileContent) || isLoading}
                size="icon"
                className="h-12 w-12 rounded-full shrink-0 bg-gradient-to-br from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white/20"
              >
                <Send className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
