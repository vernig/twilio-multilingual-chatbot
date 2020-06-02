var assistant;
const beverageValues = ['coffee', 'cappuccino', 'latte'];
const orderSamples = [
  'I would like to have {Quantity} {Beverage} please.',
  '{Quantity} {Beverage}.',
  '{Beverage}',
  'Could you make me {Quantity} {Beverage} please?',
  'Can I have {Quantity} {Beverage}?',
];

function addFieldTypes(fieldTypeSid) {
  console.log('Adding FieldTypes');
  return Promise.all(
    beverageValues.map((value) =>
      assistant
        .fieldTypes(fieldTypeSid)
        .fieldValues.create({ language: 'en-US', value })
    )
  );
}

function addSamples(taskSid) {
  console.log('Adding Samples');
  return Promise.all(
    orderSamples.map((sample) =>
      assistant
        .tasks(taskSid)
        .samples.create({ language: 'en-US', taggedText: sample })
    )
  );
}

function initAutopilot(twilioClient, domainName) {
  // Create asssistant
  return (
    twilioClient.autopilot.assistants
      .create({
        friendlyName: 'Barista',
        uniqueName: 'Barista',
      })
      .then((assistant) => Promise.resolve(assistant.sid))
      .then((assistantSid) => {
        console.log('Created assistant ', assistantSid);
        assistant = twilioClient.autopilot.assistants(assistantSid);
        return Promise.resolve('');
      })
      .then(() => assistant.fieldTypes.create({ uniqueName: 'Beverages' }))
      .then((fieldType) => addFieldTypes(fieldType.sid))
      // Add Task
      .then(() =>
        assistant.tasks.create({
          uniqueName: 'order',
          actionsUrl: `https://${domainName}/autopilot/new-order`,
        })
      )
      .then((task) => {
        console.log('Creating new task "order"');
        return assistant
          .tasks(task.sid)
          .fields.create({ fieldType: 'Beverages', uniqueName: 'Beverage' })
          .then(() =>
            assistant.tasks(task.sid).fields.create({
              fieldType: 'Twilio.NUMBER',
              uniqueName: 'Quantity',
            })
          )
          .then(() => addSamples(task.sid))
          .then(() => {});
      })
      .then(() => assistant.modelBuilds.create())
      .then((modelBuild) => {
        console.log('Model built');
        return assistant.fetch();
      })
      .catch((error) => console.error(error))
  );
}

module.exports = initAutopilot;
