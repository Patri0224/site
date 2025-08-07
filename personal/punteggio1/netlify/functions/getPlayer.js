import { neon } from '@netlify/neon';
const sql = neon();

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body || '{}');
    let gruppi = body.gruppi;

    // Validazione: array di numeri interi
    if (!Array.isArray(gruppi)) {
      gruppi = [];
    } else {
      gruppi = gruppi.map(n => parseInt(n)).filter(n => !isNaN(n));
    }

    // Default: se nessun gruppo passato
    if (gruppi.length === 0) {
      gruppi = [1];
    }

    const persone = await sql`
      SELECT id, nome
      FROM public.persone
      WHERE gruppo = ANY(${sql.array(gruppi, 'int')})
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
