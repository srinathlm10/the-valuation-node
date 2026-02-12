// Batch script to populate embeddings for all existing articles and definitions
// Run this once after setting up the RAG system

import { supabase } from '../integrations/supabase/client';

interface ContentItem {
    id: string;
    title: string;
    content: string;
    type: 'article' | 'definition';
}

export async function populateEmbeddings() {
    console.log('🚀 Starting embedding population...');

    try {
        // 1. Fetch all articles
        const { data: articles, error: articlesError } = await supabase
            .from('articles')
            .select('id, title, content');

        if (articlesError) throw articlesError;

        // 2. Fetch all definitions
        const { data: definitions, error: definitionsError } = await supabase
            .from('definitions')
            .select('id, term, definition');

        if (definitionsError) throw definitionsError;

        // 3. Prepare content items
        const contentItems: ContentItem[] = [
            ...(articles || []).map(a => ({
                id: a.id,
                title: a.title,
                content: a.content,
                type: 'article' as const
            })),
            ...(definitions || []).map(d => ({
                id: d.id,
                title: d.term,
                content: d.definition,
                type: 'definition' as const
            }))
        ];

        console.log(`📚 Found ${contentItems.length} items to process`);
        console.log(`   - ${articles?.length || 0} articles`);
        console.log(`   - ${definitions?.length || 0} definitions`);

        // 4. Process in batches to avoid rate limits
        const batchSize = 5;
        let processed = 0;
        let failed = 0;

        for (let i = 0; i < contentItems.length; i += batchSize) {
            const batch = contentItems.slice(i, i + batchSize);

            console.log(`\n⏳ Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(contentItems.length / batchSize)}...`);

            // Process batch in parallel
            const promises = batch.map(async (item) => {
                try {
                    const { data, error } = await supabase.functions.invoke('generate-embeddings', {
                        body: {
                            contentType: item.type,
                            contentId: item.id,
                            title: item.title,
                            content: item.content
                        }
                    });

                    if (error) throw error;

                    console.log(`   ✅ ${item.type}: ${item.title.substring(0, 50)}...`);
                    return { success: true, item };
                } catch (error) {
                    console.error(`   ❌ Failed: ${item.title}`, error);
                    return { success: false, item, error };
                }
            });

            const results = await Promise.all(promises);
            processed += results.filter(r => r.success).length;
            failed += results.filter(r => !r.success).length;

            // Rate limiting: wait 1 second between batches
            if (i + batchSize < contentItems.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log('\n🎉 Embedding population complete!');
        console.log(`   ✅ Processed: ${processed}`);
        console.log(`   ❌ Failed: ${failed}`);

        // 5. Get statistics
        const { data: stats, error: statsError } = await supabase
            .rpc('get_embedding_stats');

        if (!statsError && stats && stats.length > 0) {
            console.log('\n📊 Database Statistics:');
            console.log(`   Total embeddings: ${stats[0].total_embeddings}`);
            console.log(`   Articles: ${stats[0].articles_count}`);
            console.log(`   Definitions: ${stats[0].definitions_count}`);
            console.log(`   Avg content length: ${Math.round(stats[0].avg_content_length)} chars`);
        }

        return { processed, failed, total: contentItems.length };

    } catch (error) {
        console.error('❌ Error populating embeddings:', error);
        throw error;
    }
}

// Export for use in admin panel or console
if (typeof window !== 'undefined') {
    (window as any).populateEmbeddings = populateEmbeddings;
    console.log('💡 Run window.populateEmbeddings() to populate embeddings');
}
