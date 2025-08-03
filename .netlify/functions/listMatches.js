import { neon } from '@netlify/neon';
const sql = neon();
export async function handler(event, context) {
  try {
    const partite = await sql`
      SELECT id, nome_partita
      FROM posts
      ORDER BY id DESC
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(partite)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
