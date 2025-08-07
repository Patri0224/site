import { neon } from '@netlify/neon';
const sql = neon();

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body || '{}');

    // 🔧 Estrai 'gruppi' dal body
    let gruppi = body.gruppi;
    // 🔐 Validazione

   
    // 🧠 Query con IN (...) interpolato
    const persone = await sql`
      SELECT id, nome
      FROM public.persone
      WHERE gruppo IN (${gruppi})
      ORDER BY id ASC
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
