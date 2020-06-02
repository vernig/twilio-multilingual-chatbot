const fetch = require('node-fetch');

function detectLanguage(text) {
  body = {
    q: text,
  };

  return fetch(
    'https://translation.googleapis.com/language/translate/v2/detect?key=' +
      process.env.TRANSLATE_API_KEY,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }
  )
    .then((response) => response.json())
    .then((resJson) => {
      if (!resJson.error) {
        return Promise.resolve(resJson.data.detections[0][0].language);
      } else {
        console.error('detectLanguage() error: ', resJson.error.message);
        return Promise.resolve();
      }
    })
    .catch((error) => {
      console.error('detectLanguage() error: ', error);
      return Promise.resolve();
    });
}

module.exports = detectLanguage;
