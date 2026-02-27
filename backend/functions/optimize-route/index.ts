import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  return new Response(
    JSON.stringify({
      status: 'not_implemented',
      function: 'optimize-route',
      message: 'Scaffold only. Implementation deferred.',
    }),
    {
      status: 501,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
});
