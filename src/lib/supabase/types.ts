export interface Memo {
  id: string;
  title: string;
  summary_bullets: string[] | null;
  category: string | null;
  tags: string[] | null;
  source_url: string | null;
  source_type: string | null;
  created_at: string;
  raw_content: string | null;
}

export interface Database {
  public: {
    Tables: {
      memos: {
        Row: Memo;
        Insert: Omit<Memo, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Memo, 'id'>>;
      };
    };
  };
}
