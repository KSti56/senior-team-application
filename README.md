# Senior Team Application
This is the repository that contains the code for the bot that I was tasked to create for my Senior Team freelancer application.
## 1. Initial Setup — Getting your bot's token
The basis of setting up a Discord bot is creating an application in the Discord developer portal. A good guide on this process can be found [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html#your-bot-s-token). I also highly recommend disabling the "Public Bot" option and enabling all Gateway Intents (Message Content, Guild Members, etc.) as these are required for the bot to function. After this process is complete, please copy your token; it will be needed in the next step.
## 2. Setting Up The Repository

 1. Clone this repository.
 2. Run the ``npm i`` command in your bot's directory. Ensure there are no errors outputted.
 3. Open up the config.yml file and put your bot's token (from the previous step) in the config.yml under the token section (line 9). 

> Token: "YOUR-TOKEN-HERE"

 -  Configure the bot (in the config.yml) in accordance with your server; specifically, you will need to change channel and role names. Most role and channel names are generic (such as Admin, Owner, welcome, etc.)
 - Once you are happy with the configuration, make sure you save it, and then go on to the next step.
## 3. Starting Your Bot
This process will vary based on your operating system, but I have included ssteps for the three most common.
 - **Windows:** Open Command Prompt or Terminal in your bot's directory. After doing so, run ``npm run start`` **Note:** Your PC will need to stay on (and the terminal will need to be open) for your bot to stay online.
 - **Linux & MacOS:** For testing, just go to your bot's directory and run the ``npm run start`` command. For permanent deployment, I recommend using pm2. You can install pm2 with the ``sudo npm i -g pm2`` command. After that, run ``pm2 start ./src/index.js`` and your bot should stay online even after closing your terminal session. You may want to use the ``pm2 startup`` command to ensure process persistence.
 - **Pterodactyl:** If you are using the default Pterodactyl Discord.js/Node.js egg, you should be able to just press the start button.
## Troubleshooting
If you are running into unexpected issues, I would recommend starting the bot in debug mode. Debug mode is much more verbose than default and may make you aware of errors.
 - **Windows:** Run ``npm start windowsDebug``
 - **Linux, MacOS, and Pterodactyl:** Run ``npm start debug``