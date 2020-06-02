const detectLanguage = require(Runtime.getFunctions()['libs/detect-language']
  .path);
const detectIntent = require(Runtime.getFunctions()['libs/detect-intent'].path);

const autopilotWebhook = process.env.AUTOPILOT_WA_WEBHOOK;

async function executeQuery(query) {
  let queryResult = {};
  try {
    console.log(`Sending Query: ${query}`);
    intentResponse = await detectIntent(query);
    if (!intentResponse) {
      throw new Error('Error detecting intent')
    }
    console.log('Detected intent');
    console.log(
      `Intent Name: ${intentResponse.queryResult.intent.displayName}`
    );
    console;
    // Use the context from this response for next queries
    queryResult.success = true;
    queryResult.intent = intentResponse.queryResult.intent.displayName;
    queryResult.parameters = intentResponse.queryResult.parameters;
  } catch (error) {
    console.log('executeQuery() error');
    console.log(error);
    queryResult.success = false;
  }
  return queryResult;
}

exports.handler = function (context, event, callback) {
  detectLanguage(event.Body)
    .then((language) => {
      let response = '';
      switch (language) {
        case 'it':
          // Gestisci richieste in italiano
          executeQuery(event.Body).then((result) => {
            if (result.intent === 'ordine') {
              response = `Grazie! Stiamo preparando ${result.parameters.fields.number.numberValue} ${result.parameters.fields.any.stringValue}`;
            } else {
              response = 'Non ho capito. Puoi provare di nuovo?';
            }
            callback(null, response);
          });
          break;
        case 'en':
          // Handle requests in english
          response = new Twilio.twiml.MessagingResponse();
          response.redirect(autopilotWebhook);
          callback(null, response);
          break;
        case undefined:
          console.log('Error detecting language');
          callback(null, 'Sorry, language not supported');
          break;
      }
    })
    .catch((error) => {
      callback(error, null);
    });
};
