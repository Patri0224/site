// Funzione Netlify: login
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Metodo non consentito" }),
    };
  }

  try {
    const { username, password } = JSON.parse(event.body);

    if (
      username === process.env.USERNAME &&
      password === process.env.PASSWORD
    ) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    }

    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: "Credenziali errate" }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Richiesta non valida" }),
    };
  }
};
