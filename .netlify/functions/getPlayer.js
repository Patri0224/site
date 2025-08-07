import { neon } from '@netlify/neon';
const sql = neon();

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body || '{}');

    // 🔧 Estrai 'gruppi' dal body
    let gruppi = body.gruppi;

    // 🔐 Validazione
    if (!Array.isArray(gruppi)) {
      gruppi = [];
    } else {
      gruppi = gruppi.map(n => parseInt(n)).filter(n => !isNaN(n));
    }

    // Se vuoto, metti comunque 1
    if (gruppi.length === 0) {
      gruppi = [1];
    }

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
