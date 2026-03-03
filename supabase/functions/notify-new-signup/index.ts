import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const NOTIFY_EMAIL = Deno.env.get('NOTIFY_EMAIL'); // your email address

Deno.serve(async (req: Request) => {
  try {
    const payload = await req.json();

    // Supabase Database Webhook sends the new row under payload.record
    const record = payload.record;
    const email = record?.email ?? 'unknown';
    const createdAt = record?.created_at ?? new Date().toISOString();

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Mood Tracker <welcome@natashasworld.com>',
        to: [NOTIFY_EMAIL],
        subject: '🎉 New Mood Tracker Sign-Up',
        html: `
          <h2>New user signed up!</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Signed up at:</strong> ${new Date(createdAt).toLocaleString('en-US', { timeZone: 'America/New_York' })}</p>
          <p><a href="https://supabase.com/dashboard/project/qvlbhxphllzqjnqhjusi/auth/users">View in Supabase Dashboard</a></p>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Resend error:', error);
      return new Response(JSON.stringify({ error }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Function error:', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
