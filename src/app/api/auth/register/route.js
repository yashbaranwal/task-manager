
import { auth } from '@/lib/firebaseAdmin';

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Email and password required' }), { status: 400 });
  }

  try {
    const userRecord = await auth.createUser({ email, password });
    return new Response(JSON.stringify({ uid: userRecord.uid, email: userRecord.email }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
