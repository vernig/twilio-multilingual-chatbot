const fs = require('fs');
const dialogflow = require('dialogflow');

let projectId = '';
let dfConfig = {};

function loadDialogFlowConf() {
  let authFileAsset = Runtime.getAssets()[
    '/dialogflow-auth/service-account.json'
  ]
  if (!authFileAsset) {
    console.error('Dialogflow authentication file missing')
    return;
  }
  const authFile = JSON.parse(fs.readFileSync(authFileAsset.path).toString('utf-8'));
  projectId = authFile.project_id;
  dfConfig = {
    credentials: {
      private_key: authFile.private_key,
      client_email: authFile.client_email,
    },
  };
}

async function detectIntent(query) {
  loadDialogFlowConf();
  if (!projectId) {
    console.error("Error loading Dialogflow configuration")
    return;
  }
  // New session client
  const sessionClient = new dialogflow.SessionsClient(dfConfig);
  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.sessionPath(projectId, '123456');

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: 'it',
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  return responses[0];
}

module.exports = detectIntent;
