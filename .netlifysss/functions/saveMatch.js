import { neon } from '@netlify/neon';
const sql = neon();

export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);

    const {
      idPartita,
      team1Name,
      team1Score,
      team2Name,
      team2Score,
      punteggio1,
      punteggio2,
      squadra1,
      squadra2,
      punto,
      current_track,
      tempi,
      nomePartita
    } = body;

    // Converti array in stringa
    const h1 = punteggio1;
    const h2 = punteggio2;
    const m1 = squadra1;
    const m2 = squadra2;
    const temps = tempi.join(";");
    const songs = current_track; // presumo già stringa o convertita lato client

    if (idPartita == 0) {
      console.log('Inserting new match');
      const [post] = await sql`
        INSERT INTO public.partita (
          punteggio_1, punteggio_2,
          squadra1, squadra2,
          punto, current_track,
          tempi, nome_partita,
          nomes1, nomes2,
          puntis1, puntis2
        ) VALUES (
          ${h1}, ${h2},
          ${m1}, ${m2},
          ${punto}, ${songs},
          ${temps}, ${nomePartita},
          ${team1Name}, ${team2Name},
          ${parseInt(team1Score)}, ${parseInt(team2Score)}
        )
        RETURNING id
      `;
      return {
        statusCode: 200,
        body: JSON.stringify({ id: post.id })
      };
    } else {

      console.log('Updating match');
      await sql`
        UPDATE public.partita SET
          punteggio_1 = ${h1},
          punteggio_2 = ${h2},
          squadra1 = ${m1},
          squadra2 = ${m2},
          punto = ${punto},
          current_track = ${songs},
          tempi = ${temps},
          nome_partita = ${nomePartita},
          nomes1 = ${team1Name},
          nomes2 = ${team2Name},
          puntis1 = ${parseInt(team1Score)},
          puntis2 = ${parseInt(team2Score)}
        WHERE id = ${idPartita}
      `;
      return {
        statusCode: 200,
        body: JSON.stringify({ id: idPartita })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
