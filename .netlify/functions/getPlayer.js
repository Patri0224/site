import { neon } from '@netlify/neon';
const sql = neon();

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body || '{}');

    // 🔧 Estrai 'gruppi' dal body
    let gruppi = body.gruppi;
    // 🔐 Validazione

    for (let i = 0; i < gruppi.length; i++) {
      gruppi[i] = parseInt(gruppi[i]);
    }
    // Se vuoto, metti comunque 1
    if (gruppis.length === 0) {
      gruppis = [1];
    }
    // 🧠 Query con IN (...) interpolato
    const persone = await sql`
      SELECT id, nome
      FROM public.persone
      WHERE gruppo IN (`+ sql.join(gruppis, ',') + `)
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
