import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

Deno.serve(async () => {
  return new Response('ok', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
});
