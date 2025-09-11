import { neon } from '@netlify/neon';
const sql = neon();

export async function handler(event, context) {
    try {
        const { httpMethod, queryStringParameters, body } = event;

        // ===== GET eventi per giorno/mese =====
        if (httpMethod === "GET") {
            if (queryStringParameters.day && queryStringParameters.month) {
                const day = parseInt(queryStringParameters.day);
                const month = parseInt(queryStringParameters.month);

                const events = await sql`
          SELECT nome, ripetibile
          FROM public.calendar
          WHERE EXTRACT(DAY FROM data) = ${day}
            AND EXTRACT(MONTH FROM data) = ${month}
          ORDER BY id ASC
        `;

                return { statusCode: 200, body: JSON.stringify(events) };
            }
            // GET eventi per un mese intero
            if (queryStringParameters.month && !queryStringParameters.day) {
                const month = parseInt(queryStringParameters.month);

                const events = await sql`
    SELECT EXTRACT(DAY FROM data) AS day, nome, ripetibile
    FROM public.calendar
    WHERE EXTRACT(MONTH FROM data) = ${month}
    ORDER BY day ASC
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
            SELECT nome, ripetibile
            FROM public.calendar
            WHERE EXTRACT(DAY FROM data) = ${day}
              AND EXTRACT(MONTH FROM data) = ${month}
            ORDER BY id ASC
          `;

                    result[`${day}-${month}`] = events;
                }

                return { statusCode: 200, body: JSON.stringify(result) };
            }
        }

        // ===== POST nuovo evento =====
        if (httpMethod === "POST") {
            const { day, month, nome, ripetibile } = JSON.parse(body);

            // anno bisestile 2024
            const date = new Date(2024, month - 1, day);

            await sql`
                    INSERT INTO public.calendar (nome, data, ripetibile)
                    VALUES (${nome}, ${date.toISOString()}, ${ripetibile})
      `;

            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        }
        if (event.httpMethod === "DELETE") {
            const { day, month, nome } = JSON.parse(event.body);
            await client.sql`
            DELETE FROM calendar
            WHERE nome = ${nome} AND EXTRACT(DAY FROM data) = ${day} AND EXTRACT(MONTH FROM data) = ${month}
        `;
            return { statusCode: 200, body: JSON.stringify({ success: true }) };
        }

        
        return { statusCode: 400, body: "Bad Request" };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
}
