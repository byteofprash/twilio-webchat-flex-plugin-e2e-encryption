## What

This is a [Flex Plugin](https://www.twilio.com/docs/flex/developer/plugins) that allows Agents to decrypt and view end-to-end encrypted messages coming from the WebChat.

## To install the Flex Plugin:

1. clone this repo;
1. execute `cd ./twilio-flex-plugin` to go to the Plugin folder.
1. `npm install` to install the packages into your computer.
1. You need to have the [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart). Type `twilio` in your terminal to see if you have it, if not, install it now.
1. You need the [Flex Plugins CLI](https://www.twilio.com/docs/flex/developer/plugins/cli/install) . Type `twilio plugins` to make sure you have it, if not, install it.
1. You need to create a new profile for your Twilio CLI, type `twilio profiles:list` to check if you are using it correctly. If not, add a new profile with the cmd `twilio profiles:add`.
1. `npm run deploy -- --changelog "first deployment!"` to deploy this Plugin.
1. Once **step 8** is finished, it will show the next steps, you will have to run the command mentioned there (something like `twilio flex:plugins:release ... etc etc`)
1. We are done! Go to https://flex.twilio.com - if you already have the WebChat running, go there and create a new Chat to receive the task on Flex and see this Plugin decrypting the end-to-end messages!
