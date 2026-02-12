-- RAG System Setup: Enable pgvector and create knowledge embeddings table
-- This enables semantic search for FinBot using existing articles and definitions

-- 1. Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create knowledge_embeddings table
CREATE TABLE IF NOT EXISTS knowledge_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('article', 'definition')),
  content_id text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  embedding vector(768), -- Gemini embedding-001 dimension
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(content_type, content_id)
);

-- 3. Create indexes for performance
-- Vector index for similarity search (IVFFlat algorithm)
CREATE INDEX IF NOT EXISTS knowledge_embeddings_embedding_idx 
ON knowledge_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Regular indexes for filtering
CREATE INDEX IF NOT EXISTS knowledge_embeddings_content_type_idx 
ON knowledge_embeddings(content_type);

CREATE INDEX IF NOT EXISTS knowledge_embeddings_created_at_idx 
ON knowledge_embeddings(created_at DESC);

-- Full-text search index for title and content
CREATE INDEX IF NOT EXISTS knowledge_embeddings_search_idx 
ON knowledge_embeddings 
USING gin(to_tsvector('english', title || ' ' || content));

-- 4. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_knowledge_embeddings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create trigger for updated_at
DROP TRIGGER IF EXISTS knowledge_embeddings_updated_at_trigger ON knowledge_embeddings;
CREATE TRIGGER knowledge_embeddings_updated_at_trigger
  BEFORE UPDATE ON knowledge_embeddings
  FOR EACH ROW
  EXECUTE FUNCTION update_knowledge_embeddings_updated_at();

-- 6. Enable Row Level Security (RLS)
ALTER TABLE knowledge_embeddings ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies
-- Allow public read access (for chatbot to search)
CREATE POLICY "Allow public read access to knowledge embeddings"
ON knowledge_embeddings
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert/update (for admin functions)
CREATE POLICY "Allow authenticated users to insert knowledge embeddings"
ON knowledge_embeddings
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update knowledge embeddings"
ON knowledge_embeddings
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to delete knowledge embeddings"
ON knowledge_embeddings
FOR DELETE
TO authenticated
USING (true);

-- 8. Create helper function for semantic search
CREATE OR REPLACE FUNCTION search_knowledge(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 3
)
RETURNS TABLE (
  id uuid,
  content_type text,
  content_id text,
  title text,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_embeddings.id,
    knowledge_embeddings.content_type,
    knowledge_embeddings.content_id,
    knowledge_embeddings.title,
    knowledge_embeddings.content,
    knowledge_embeddings.metadata,
    1 - (knowledge_embeddings.embedding <=> query_embedding) AS similarity
  FROM knowledge_embeddings
  WHERE 1 - (knowledge_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 9. Create function to get embedding statistics
CREATE OR REPLACE FUNCTION get_embedding_stats()
RETURNS TABLE (
  total_embeddings bigint,
  articles_count bigint,
  definitions_count bigint,
  avg_content_length numeric,
  last_updated timestamptz
)
LANGUAGE sql
AS $$
  SELECT
    COUNT(*) as total_embeddings,
    COUNT(*) FILTER (WHERE content_type = 'article') as articles_count,
    COUNT(*) FILTER (WHERE content_type = 'definition') as definitions_count,
    AVG(LENGTH(content)) as avg_content_length,
    MAX(updated_at) as last_updated
  FROM knowledge_embeddings;
$$;

-- 10. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON knowledge_embeddings TO anon, authenticated;
GRANT ALL ON knowledge_embeddings TO authenticated;
GRANT EXECUTE ON FUNCTION search_knowledge TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_embedding_stats TO anon, authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'RAG system setup complete! pgvector enabled and knowledge_embeddings table created.';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Deploy the generate-embeddings Edge Function';
  RAISE NOTICE '2. Run the population script to create embeddings for existing content';
  RAISE NOTICE '3. Update the chat Edge Function to use semantic search';
END $$;
