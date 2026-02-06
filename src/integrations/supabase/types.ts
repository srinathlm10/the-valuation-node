export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string
          title: string
          excerpt: string
          content: string
          category_id: string
          difficulty: "beginner" | "intermediate" | "advanced"
          reading_time: number
          author: string
          published_at: string
          image_url: string | null
          key_takeaways: string[]
          related_article_ids: string[]
          created_at: string
        }
        Insert: {
          id: string
          title: string
          excerpt: string
          content: string
          category_id: string
          difficulty: "beginner" | "intermediate" | "advanced"
          reading_time: number
          author: string
          published_at: string
          image_url?: string | null
          key_takeaways?: string[]
          related_article_ids?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          excerpt?: string
          content?: string
          category_id?: string
          difficulty?: "beginner" | "intermediate" | "advanced"
          reading_time?: number
          author?: string
          published_at?: string
          image_url?: string | null
          key_takeaways?: string[]
          related_article_ids?: string[]
          created_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          icon_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon_name?: string | null
          created_at?: string
        }
        Relationships: []
      }
      definitions: {
        Row: {
          id: string
          term: string
          full_name: string
          category: string
          category_id: string
          definition: string
          formula: string | null
          why_it_matters: string | null
          example: string | null
          related_terms: string[]
          created_at: string
        }
        Insert: {
          id: string
          term: string
          full_name: string
          category: string
          category_id: string
          definition: string
          formula?: string | null
          why_it_matters?: string | null
          example?: string | null
          related_terms?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          term?: string
          full_name?: string
          category?: string
          category_id?: string
          definition?: string
          formula?: string | null
          why_it_matters?: string | null
          example?: string | null
          related_terms?: string[]
          created_at?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          user_id: string
          content_id: string
          completed: boolean
          completed_at: string | null
        }
        Insert: {
          user_id: string
          content_id: string
          completed?: boolean
          completed_at?: string | null
        }
        Update: {
          user_id?: string
          content_id?: string
          completed?: boolean
          completed_at?: string | null
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          article_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          username: string | null
          bio: string | null
          website: string | null
          streak_count: number | null
          total_points: number | null
          last_login: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
          bio?: string | null
          website?: string | null
          streak_count?: number | null
          total_points?: number | null
          last_login?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
          bio?: string | null
          website?: string | null
          streak_count?: number | null
          total_points?: number | null
          last_login?: string | null
        }
        Relationships: []
      }
      stocks: {
        Row: {
          id: string
          name: string
          sector: string
          market_cap: number
          pe_ratio: number
          pb_ratio: number
          roe: number
          debt_to_equity: number
          dividend_yield: number
          eps: number
          revenue_growth_5y: number
          profit_growth_5y: number
          current_price: number
          week_high_52: number
          week_low_52: number
          created_at: string
        }
        Insert: {
          id: string
          name: string
          sector: string
          market_cap: number
          pe_ratio: number
          pb_ratio: number
          roe: number
          debt_to_equity: number
          dividend_yield: number
          eps: number
          revenue_growth_5y: number
          profit_growth_5y: number
          current_price: number
          week_high_52: number
          week_low_52: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          sector?: string
          market_cap?: number
          pe_ratio?: number
          pb_ratio?: number
          roe?: number
          debt_to_equity?: number
          dividend_yield?: number
          eps?: number
          revenue_growth_5y?: number
          profit_growth_5y?: number
          current_price?: number
          week_high_52?: number
          week_low_52?: number
          created_at?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string
          icon_url: string
          category: string
          created_at: string
        }
        Insert: {
          id: string
          name: string
          description: string
          icon_url: string
          category: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon_url?: string
          category?: string
          created_at?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          user_id: string
          badge_id: string
          awarded_at: string
        }
        Insert: {
          user_id: string
          badge_id: string
          awarded_at?: string
        }
        Update: {
          user_id?: string
          badge_id?: string
          awarded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      quizzes: {
        Row: {
          id: string
          article_id: string
          title: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          article_id: string
          title: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          title?: string
          description?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_article_id_fkey"
            columns: ["article_id"]
            referencedRelation: "articles"
            referencedColumns: ["id"]
          }
        ]
      }
      questions: {
        Row: {
          id: string
          quiz_id: string
          question: string
          options: string[]
          correct_answer_index: number
          explanation: string | null
          created_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          question: string
          options: string[]
          correct_answer_index: number
          explanation?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          question?: string
          options?: string[]
          correct_answer_index?: number
          explanation?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          }
        ]
      }
      user_quiz_attempts: {
        Row: {
          id: string
          user_id: string
          quiz_id: string
          score: number
          total_questions: number
          passed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quiz_id: string
          score: number
          total_questions: number
          passed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quiz_id?: string
          score?: number
          total_questions?: number
          passed?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      posts: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          category?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      post_likes: {
        Row: {
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          post_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never
