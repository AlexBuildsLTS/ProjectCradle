import { serve } from "std/http/server.ts"
import { createClient } from "@supabase/supabase-js"

interface ChatBody {
  query: string;
}

serve(async (req: Request) => {
  try {
    const { query } = await req.json() as ChatBody;
    
    // 1. Initialize Supabase Admin (Bypass RLS for AI context)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 2. Fetch Context (Care Ledger + Baby Profile)
    const { data: logs, error: dbError } = await supabaseAdmin
      .from('care_events')
      .select('event_type, timestamp, metadata')
      .order('timestamp', { ascending: false })
      .limit(50);

    if (dbError) throw dbError;

    // 3. Construct High-Fidelity Prompt
    const systemPrompt = `You are Berry, a pediatric sleep expert. 
    Contextual Logs: ${JSON.stringify(logs)}.
    Guide parents with empathy. Use Awake Window science.`;

    // 4. OpenAI Integration
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
      }),
    });

    const aiData = await response.json();
    const berryResponse = aiData.choices[0].message.content;

    return new Response(JSON.stringify({ response: berryResponse }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: unknown) {
    // High-integrity error handling: cast unknown to Error
    const errorMessage = err instanceof Error ? err.message : "Internal Surveillance Error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});