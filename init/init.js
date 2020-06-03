const fs = require('fs');
const Inquirer = require('inquirer');
// const TwilioServerlessApiClient = require('@twilio-labs/serverless-api');
const initAutopilot = require('./init-autopilot');
const { initServerless, deployServerless } = require('./twilio-serverless');
const SERVICE_NAME = 'barista';

function json2env(obj) {
  let tmp = '';
  for (let key in obj) {
    tmp += `${key}="${obj[key]}"\n`;
  }
  return tmp;
}

// TODO: Attempt loading .env file

Inquirer.prompt([
  {
    type: 'string',
    name: 'accountSid',
    message: 'Account SID:',
  },
  {
    type: 'password',
    name: 'authToken',
    message: 'Account auth token:',
  },
  {
    type: 'password',
    name: 'translateApiKey',
    message: 'Google translate API key',
  },
  {
    type: 'confirm',
    name: 'initAutopilot',
    message: 'Do you want to inizialize Autopilot assistant?',
  },
]).then(async function (answers) {
  let env = {};

  env.TRANSLATE_API_KEY = answers.translateApiKey;
  env.AUTOPILOT_WA_WEBHOOK;

  twilioClient = require('twilio')(answers.accountSid, answers.authToken);

  // Init serverless environment and get domain
  let serverlessEnvironment = await initServerless(
    answers.accountSid,
    answers.authToken,
    SERVICE_NAME,
    'dev'
  );
  let domain = serverlessEnvironment.domain_name;
  console.log('Serverless environment initialized on domain ', domain);

  if (answers.initAutopilot) {
    assistant = await initAutopilot(twilioClient, domain);
    env.AUTOPILOT_WA_WEBHOOK = `https://channels.autopilot.twilio.com/v1/${assistant.accountSid}/${assistant.sid}/twilio-messaging/whatsapp`;
  }
  // TODO: Check Dialogflow service account json file
  // Deploy
  let buildInfo = await deployServerless(
    answers.accountSid,
    answers.authToken,
    SERVICE_NAME,
    env
  );
  console.log('Runtime environment deployed');
  console.log(
    `\nConfigure your messaging / whatsapp webhook to the following url: https://${domain}/incoming-message`
  );

  // Write env file
  env.ACCOUNT_SID = answers.accountSid;
  env.AUTH_TOKEN = answers.authToken;
  fs.writeFileSync('.env', json2env(env));

  // Write .twilio-functions
  let twilioFunctionsFile = { projects: {} };
  twilioFunctionsFile['projects'][answers.accountSid] = {
    serviceSid: buildInfo.serviceSid,
    latestBuild: buildInfo.buildSid,
  };
  fs.writeFileSync('.twilio-functions', JSON.stringify(twilioFunctionsFile));
});
