import { neon } from '@netlify/neon';
const sql = neon();

export async function handler(event, context) {
  try {
    const persone = await sql`
      SELECT id, nome
      FROM public.persone
      ORDER BY id asc
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(persone)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
