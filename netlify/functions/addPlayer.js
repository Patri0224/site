import { neon } from '@netlify/neon';
const sql = neon();

export async function handler(event, context) {
  try {
    // Parsing il corpo della richiesta (assumendo che sia JSON con "nome")
    const { nome } = JSON.parse(event.body);

    if (!nome || typeof nome !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Il campo "nome" è obbligatorio.' })
      };
    }

    // Esegui l'inserimento
    const result = await sql`
      INSERT INTO public.persone (nome)
      VALUES (${nome})
    `;

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Giocatore aggiunto' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
