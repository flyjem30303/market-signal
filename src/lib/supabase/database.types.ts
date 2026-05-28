export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      data_runs: {
        Row: {
          created_at: string;
          data_end_date: string | null;
          data_start_date: string | null;
          error_message: string | null;
          finished_at: string | null;
          id: string;
          notes: string | null;
          row_count: number;
          run_key: string;
          source_name: string;
          source_url: string | null;
          started_at: string;
          status: "success" | "partial" | "failed";
          target_table: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          data_end_date?: string | null;
          data_start_date?: string | null;
          error_message?: string | null;
          finished_at?: string | null;
          id?: string;
          notes?: string | null;
          row_count?: number;
          run_key: string;
          source_name: string;
          source_url?: string | null;
          started_at: string;
          status: "success" | "partial" | "failed";
          target_table: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["data_runs"]["Insert"]>;
      };
      market_exchanges: {
        Row: {
          country: string;
          created_at: string;
          currency: string;
          display_name: string;
          exchange: string;
          is_active: boolean;
          locale: string;
          name: string;
          timezone: string;
          updated_at: string;
        };
        Insert: {
          country: string;
          created_at?: string;
          currency: string;
          display_name: string;
          exchange: string;
          is_active?: boolean;
          locale?: string;
          name: string;
          timezone: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["market_exchanges"]["Insert"]>;
      };
      stocks: {
        Row: {
          created_at: string;
          id: string;
          industry: string | null;
          is_active: boolean;
          is_etf: boolean;
          listed_date: string | null;
          market: string;
          country: string;
          exchange: string;
          currency: string;
          timezone: string;
          asset_type: string;
          name: string;
          symbol: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          industry?: string | null;
          is_active?: boolean;
          is_etf?: boolean;
          listed_date?: string | null;
          market: string;
          country?: string;
          exchange?: string;
          currency?: string;
          timezone?: string;
          asset_type?: string;
          name: string;
          symbol: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["stocks"]["Insert"]>;
      };
      daily_scores: {
        Row: {
          composite_score: number;
          created_at: string;
          data_quality_grade: "A" | "B" | "C" | "D";
          data_quality_score: number;
          health_score: number;
          last_updated_at: string;
          missing_module_flags: string[];
          model_version: string;
          risk_score: number;
          signal: "green" | "yellow" | "orange" | "red" | "deep-red";
          stale_data_flags: string[];
          stock_id: string;
          trade_date: string;
        };
        Insert: {
          composite_score: number;
          created_at?: string;
          data_quality_grade?: "A" | "B" | "C" | "D";
          data_quality_score?: number;
          health_score: number;
          last_updated_at?: string;
          missing_module_flags?: string[];
          model_version: string;
          risk_score: number;
          signal: "green" | "yellow" | "orange" | "red" | "deep-red";
          stale_data_flags?: string[];
          stock_id: string;
          trade_date: string;
        };
        Update: Partial<Database["public"]["Tables"]["daily_scores"]["Insert"]>;
      };
      score_modules: {
        Row: {
          created_at: string;
          health: number;
          model_version: string;
          module_key: string;
          risk: number;
          stock_id: string;
          trade_date: string;
          weight: number;
        };
        Insert: {
          created_at?: string;
          health: number;
          model_version: string;
          module_key: string;
          risk: number;
          stock_id: string;
          trade_date: string;
          weight: number;
        };
        Update: Partial<Database["public"]["Tables"]["score_modules"]["Insert"]>;
      };
      news_items: {
        Row: {
          category: string;
          created_at: string;
          id: string;
          impact_score: number;
          published_at: string;
          source: string;
          summary: string | null;
          title: string;
          url: string | null;
        };
        Insert: {
          category: string;
          created_at?: string;
          id?: string;
          impact_score: number;
          published_at: string;
          source: string;
          summary?: string | null;
          title: string;
          url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["news_items"]["Insert"]>;
      };
      stock_news: {
        Row: {
          news_id: string;
          relevance_score: number;
          stock_id: string;
        };
        Insert: {
          news_id: string;
          relevance_score?: number;
          stock_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["stock_news"]["Insert"]>;
      };
      user_favorites: {
        Row: {
          created_at: string;
          stock_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          stock_id: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_favorites"]["Insert"]>;
      };
    };
  };
};
