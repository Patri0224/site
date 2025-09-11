// ./netlify/functions/events.js
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

client.connect();

exports.handler = async function(event, context) {
  const { httpMethod, queryStringParameters, body } = event;

  if (httpMethod === "GET") {
    if (queryStringParameters.day && queryStringParameters.month) {
      // GET /events?day=DD&month=MM
      const day = parseInt(queryStringParameters.day);
      const month = parseInt(queryStringParameters.month);
      const res = await client.query(
        "SELECT nome, ripetibile FROM calendar WHERE EXTRACT(DAY FROM data)=$1 AND EXTRACT(MONTH FROM data)=$2",
        [day, month]
      );
      return {
        statusCode: 200,
        body: JSON.stringify(res.rows)
      };
    } else if (queryStringParameters.week) {
      // GET /events/week
      const today = new Date();
      const week = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        week.push({ day: date.getDate(), month: date.getMonth()+1 });
      }
      const result = {};
      for (const d of week) {
        const res = await client.query(
          "SELECT nome, ripetibile FROM calendar WHERE EXTRACT(DAY FROM data)=$1 AND EXTRACT(MONTH FROM data)=$2",
          [d.day, d.month]
        );
        result[`${d.day}-${d.month}`] = res.rows;
      }
      return { statusCode: 200, body: JSON.stringify(result) };
    }
  } else if (httpMethod === "POST") {
    const { day, month, nome, ripetibile } = JSON.parse(body);
    const date = new Date(2024, month - 1, day); // anno bisestile
    await client.query(
      "INSERT INTO calendar (nome, data, ripetibile) VALUES ($1,$2,$3)",
      [nome, date.toISOString(), ripetibile]
    );
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }

  return { statusCode: 400, body: "Bad Request" };
};
