# Multilingual chatbot using Twilio

This project is the code companion of [this blogpost](https://www.twilio.com/blog/chatbot-multilingue-per-whatsapp) (in italian). Using this repo you can provision your Twilio account automatically in few minutes. 

The flow implemented in this project is the following: 

![diagram](https://github.com/vernig/twilio-multilingual-chatbot/blob/master/diagram.png)

# How to use this repo 

This repo contains a collection of assets and functions for Twilio Runtime, as well as an [initalization script](#provisioning-your-twilio-account) to provision your account with a preconfigured Twilio autopilot bot. Before running the script you need to create your Google Dialogflow agent and (optionally) get your Google Translate API key. 

## Google translate API key

Since the Google Translate API has a price per usage, this step is optional. If you want to use different methods to detect the language, you have to modify the `detect-language.js` file. 
 
Use the following procedure to create a new project in Google Cloud and get your API key: 

* Go to [this page](https://console.cloud.google.com/projectselector2/home/dashboard) and (after login) click on "Create Project"
* Go to the ["API and Services"](https://console.cloud.google.com/apis/dashboard)
* Click on "+ Enable API and Services"
* Look for "Cloud Translation API" and click on it
* In the page that opens, click on "Enable" 
* On the Google Cloud conosole go to ["Credentials"](https://console.cloud.google.com/apis/credentials)
* Click on "+ Create Credentials"
* Select "API key"
* Copy the API key and save it somewhere safe 
* Click on close

## Create a new Agent in Google Dialogflow

Use the following procedure to create a new agent in Google Dialogflow: 

* Login on [Dialogflow console](https://dialogflow.cloud.google.com/)
* On the side bar, click on the little arrow pointing down and select "New Agent"
![Dialogflow New Agent](https://twilio-cms-prod.s3.amazonaws.com/images/dialogflow-newagent.width-800.png)
* Give a name to the Agent (e.g. "Barista")
* As default language select "Italian - it"
* Click on Create
* Now click on  the little gear next to the agent name on the sidebar 
* Click on "Export Import"
* Click on the "Import from ZIP" button 
* In the popup that opens, upload the zip file that you find in this repo in [`dialogflow-intents/Barista.zip`](https://github.com/vernig/twilio-multilingual-chatbot/blob/master/dialogflow-intents/Barista.zip). This will initialize a new intent to recognize a new order 

Once the Agent is created, you need to get your credential to use this agent from Twilio: 

* Click on the little gear next to the Agent name
* The page with the project properties will open
* Click on the link in the "Service Account" section that looks like an email address. If you don't have any link, click on the little refresh button

![Dialogflow Service Account](https://twilio-cms-prod.s3.amazonaws.com/images/dialogflow-project_1PbHnSe.width-1600.png)

* This will open the "Servicd Account" page in the Google cloud console
* Click on the service account that was shown in the Dialogflow project properties 
* Click on "Edit" and then on "+ Create Key"
* A new menu will open on the right. Select "JSON" and click on "Create"
* Your browser will download the json file automatically 
* Copy the file into the folder `assets/dialogflow-auth`. The name of the file must be `servce-account.private.json`. It's very important the name as `private` before the file extension, otherwise your file can be accessed by anybody 
* In the Google Cloud console click on "Done" and then "Save"

## Provisioning your Twilio account

Now you should have everything you need to connect your Twilio account to the Google Services. From a terminal type: 

```
npm install 
npm run twilio-init
```

The script will ask you the following questions: 
* Twilio account SID (can abe found [in the home page of your Twilio project](https://twilio.com/console))
* Twilio auth token (can abe found [[in the home page of your Twilio project](https://twilio.com/console))
* Google Translate API key: provide here the key you obtained with [this procedure](#google-translate-api-key)
* If you want to create a new Autopilot agent

Once the script is finished, it will provide you with a link to provision your WhatsApp sender / sandbox:

```
Runtime environment deployed
Configure your messaging / whatsapp webhook to the following url: https://barista-xxxx-dev.twil.io/incoming-message`)
```

In your Twilio console go to the [sandbox configuration page](https://www.twilio.com/console/sms/whatsapp/sandbox) or the [sender configuration page](https://www.twilio.com/console/sms/whatsapp/senders) and paste the above link to the "When a message comes in" webhook". Remmeber to Save the configuration. 

## Test  the solution

Using your mobile send a message to the WhatsApp number configured above. You should see the following for Italian: 

![Order through WhatsApp in Italian](https://twilio-cms-prod.s3.amazonaws.com/images/test-whatsapp-italian.width-1600.png)

And for English:

![Order through WhatsApp in English](https://twilio-cms-prod.s3.amazonaws.com/images/test-whatsapp-english.width-1600.png)

## Make changes and re-deploy

In order to re-deploy the solution after the intial set-up use: 

```
npm run deploy
```