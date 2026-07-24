import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { error } = await supabase.from('profiles').select('id').limit(1);

  if (error) {
    return new Response('error: ' + error.message, { status: 500 });
  }

  return new Response('ok', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
});
