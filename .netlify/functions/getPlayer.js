import { neon } from '@netlify/neon';
const sql = neon();

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body || '{}');

    // Validazione di sicurezza: assicurati che 'gruppi' sia un array di interi
    const gruppi = Array.isArray(body.gruppi)
      ? body.gruppi.map(Number).filter(n => Number.isInteger(n))
      : [];

    if (gruppi.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Nessun gruppo valido specificato' })
      };
    }

    const persone = await sql`
      SELECT id, nome
      FROM public.persone
      WHERE gruppo IN (${sql.array(gruppi, 'int')})
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
