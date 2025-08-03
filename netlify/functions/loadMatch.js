import { neon } from '@netlify/neon';
const sql = neon();

export async function handler(event, context) {
  try {
    const idPartita = event.queryStringParameters?.id;

    if (!idPartita) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Parametro 'id' mancante" })
      };
    }

    const [data] = await sql`SELECT * FROM posts WHERE id = ${idPartita}`;

    if (!data) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Partita non trovata" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
