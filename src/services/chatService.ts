import { supabase } from "@/integrations/supabase/client";

export interface ChatSession {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
}

export interface ChatMessage {
    id: string;
    session_id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

export const chatService = {
    // 1. Create a new session
    async createSession(title: string = "New Chat") {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('chat_sessions')
            .insert({ user_id: user.id, title })
            .select()
            .single();

        if (error) throw error;
        return data as ChatSession;
    },

    // 2. Get all sessions for user
    async getSessions() {
        const { data, error } = await supabase
            .from('chat_sessions')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) throw error;
        return data as ChatSession[];
    },

    // 3. Get messages for a session
    async getMessages(sessionId: string) {
        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data as ChatMessage[];
    },

    // 4. Save a message to history
    async saveMessage(sessionId: string, role: 'user' | 'assistant', content: string) {
        const { data, error } = await supabase
            .from('chat_messages')
            .insert({ session_id: sessionId, role, content })
            .select()
            .single();

        if (error) throw error;

        // Update session timestamp
        await supabase
            .from('chat_sessions')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', sessionId);

        return data as ChatMessage;
    },

    // 5. Update session title
    async updateSessionTitle(sessionId: string, title: string) {
        const { error } = await supabase
            .from('chat_sessions')
            .update({ title })
            .eq('id', sessionId);

        if (error) throw error;
    },

    // 6. Delete session
    async deleteSession(sessionId: string) {
        const { error } = await supabase
            .from('chat_sessions')
            .delete()
            .eq('id', sessionId);

        if (error) throw error;
    }
};
