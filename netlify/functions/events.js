import { neon } from '@netlify/neon';
const sql = neon();

export async function handler(event, context) {
    try {
        const { httpMethod, queryStringParameters, body } = event;
        const persona = queryStringParameters.persona || 0;
        // ===== GET eventi per giorno/mese =====
        if (httpMethod === "GET") {
            if (queryStringParameters.day && queryStringParameters.month) {
                const day = parseInt(queryStringParameters.day);
                const month = parseInt(queryStringParameters.month);

                const events = await sql`
            SELECT nome, ripetibile, ora_inizio, ora_fine
            FROM public.calendar
            WHERE EXTRACT(DAY FROM data) = ${day}
              AND EXTRACT(MONTH FROM data) = ${month}
              AND persona = ${persona}
            ORDER BY ora_inizio ASC, ripetibile ASC, id ASC;

        `;

                return { statusCode: 200, body: JSON.stringify(events) };
            }
            // GET eventi per un mese intero
            if (queryStringParameters.month && !queryStringParameters.day) {
                const month = parseInt(queryStringParameters.month);

                const events = await sql`
                 SELECT EXTRACT(DAY FROM data) AS day, nome, ripetibile, ora_inizio, ora_fine
                    FROM public.calendar
                WHERE EXTRACT(MONTH FROM data) = ${month}
              AND persona = ${persona}
                ORDER BY day ASC, ora_inizio ASC, ripetibile ASC, id ASC;

  `;

                return { statusCode: 200, body: JSON.stringify(events) };
            }

            // GET eventi prossimi 7 giorni
            if (queryStringParameters.week) {
                const today = new Date();
                const result = {};

                for (let i = 0; i < 7; i++) {
                    const date = new Date(today);
                    date.setDate(today.getDate() + i);

                    const day = date.getDate();
                    const month = date.getMonth() + 1;

                    const events = await sql`
            SELECT nome, ripetibile, ora_inizio, ora_fine
            FROM public.calendar
            WHERE EXTRACT(DAY FROM data) = ${day}
              AND EXTRACT(MONTH FROM data) = ${month}
              AND persona = ${persona}
            ORDER BY ora_inizio ASC, ripetibile ASC, id ASC
          `;

                    result[`${day}-${month}`] = events;
                }

                return { statusCode: 200, body: JSON.stringify(result) };
            }
            // 🔎 Ricerca eventi per nome
            if (queryStringParameters.search) {
                const search = queryStringParameters.search;
                const recurring = queryStringParameters.recurring === "true";

                let events;

                if (recurring) {
                    // includi anche i ricorrenti
                    events = await sql`
                        SELECT id, nome, data, ripetibile, ora_inizio, ora_fine
                        FROM public.calendar
                        WHERE nome ILIKE ${'%' + search + '%'}
                          AND persona = ${persona}
                        ORDER BY data ASC, ora_inizio ASC
                    `;
                } else {
                    // solo eventi singoli
                    events = await sql`
                        SELECT id, nome, data, ripetibile, ora_inizio, ora_fine
                        FROM public.calendar
                        WHERE nome ILIKE ${'%' + search + '%'}
                          AND ripetibile = false
                          AND persona = ${persona}
                        ORDER BY data ASC, ora_inizio ASC
                    `;
                }

                return { statusCode: 200, body: JSON.stringify(events) };
            }
        }

        // ===== POST nuovo evento =====
        if (httpMethod === "POST") {
            const { day, month, nome, ripetibile, oraInizio, oraFine, persona } = JSON.parse(body);

            // anno bisestile 2024
            const date = new Date(2024, month - 1, day);

            await sql`
                    INSERT INTO public.calendar (nome, data, ripetibile, ora_inizio, ora_fine, persona)
                    VALUES (${nome}, ${date.toISOString()}, ${ripetibile}, ${oraInizio || '00:00:00'}, ${oraFine || '00:00:00'}, ${persona});

      `;

            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        }

        // ===== DELETE evento =====
        if (httpMethod === "DELETE") {
            const { day, month, nome } = JSON.parse(body);

            await sql`
        DELETE FROM public.calendar
        WHERE nome = ${nome} 
          AND EXTRACT(DAY FROM data) = ${day} 
          AND EXTRACT(MONTH FROM data) = ${month}
          AND persona = ${persona};
    `;

            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        }



        return { statusCode: 400, body: "Bad Request" };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
}
