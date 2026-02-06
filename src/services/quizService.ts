import { supabase } from "@/integrations/supabase/client";

export interface Quiz {
    id: string;
    article_id: string;
    title: string;
    description: string | null;
    questions: Question[];
}

export interface Question {
    id: string;
    question: string;
    options: string[];
    correct_answer_index: number;
    explanation: string | null;
}

export interface QuizResult {
    score: number;
    total: number;
    passed: boolean;
}

export const quizService = {
    // Get Quiz for an Article
    async getQuizByArticleId(articleId: string): Promise<Quiz | null> {
        const { data: quiz, error } = await supabase
            .from("quizzes")
            .select(`
        *,
        questions (*)
      `)
            .eq("article_id", articleId)
            .maybeSingle();

        if (error) {
            console.error("Error fetching quiz:", error);
            return null;
        }

        return quiz;
    },

    // Submit Quiz Attempt
    async submitQuizAttempt(quizId: string, score: number, totalQuestions: number): Promise<QuizResult | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const passed = (score / totalQuestions) >= 0.7; // 70% to pass

        const { error } = await supabase
            .from("user_quiz_attempts")
            .insert({
                user_id: user.id,
                quiz_id: quizId,
                score,
                total_questions: totalQuestions,
                passed
            });

        if (error) {
            console.error("Error submitting quiz attempt:", error);
            return null;
        }

        return { score, total: totalQuestions, passed };
    },

    // Check if user has already passed this quiz
    async getPreviousAttempt(quizId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from("user_quiz_attempts")
            .select("*")
            .eq("quiz_id", quizId)
            .eq("user_id", user.id)
            .eq("passed", true)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            console.error("Error checking previous attempt:", error);
        }

        return data;
    }
};
