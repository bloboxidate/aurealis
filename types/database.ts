/**
 * Regenerate with `supabase gen types typescript` when the schema changes.
 * Keep in sync with `supabase/migrations/*.sql`.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name_en: string;
          name_ar: string;
          description_en: string;
          description_ar: string;
          price_egp: number;
          category: string;
          image: string;
          in_stock: boolean;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          slug: string;
          name_en: string;
          name_ar: string;
          description_en: string;
          description_ar: string;
          price_egp: number;
          category: string;
          image: string;
          in_stock?: boolean;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name_en?: string;
          name_ar?: string;
          description_en?: string;
          description_ar?: string;
          price_egp?: number;
          category?: string;
          image?: string;
          in_stock?: boolean;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
