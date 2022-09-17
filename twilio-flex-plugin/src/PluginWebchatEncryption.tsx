import axios from 'axios';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import { encrypt } from './helpers/naclForFlexPlugins';
import { download, encryptFile } from './helpers/downloadFile';
import DecryptMessageBubble from './components/DecryptMessageBubble/DecryptMessageBubble';

const PLUGIN_NAME = 'plugin-webchat-e2e-encryption';

export default class PluginWebchatEncryption extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    flex.Actions.addListener('beforeAcceptTask', async (payload) => {
      // console.log('@@@ beforeAcceptTask', payload);
      const { conversationSid } = payload.task.attributes;

      if (!conversationSid) {
        console.log('@@@ Not a chat, aborting...');
        return;
      }

      const conversation = await manager.conversationsClient.getConversationBySid(conversationSid);
      // console.log('@@@ conversation.attributes', conversation.attributes);

      const { customerPublicKey } = conversation.attributes;
      encrypt.init(conversationSid, customerPublicKey);
      const agentPublicKey = encrypt.myPublicKey(conversationSid);
      await conversation.updateAttributes({ ...conversation.attributes, agentPublicKey });
    });

    flex.Actions.addListener('beforeSendMessage', async (payload) => {
      // console.log('@@@ beforeSendMessage payload: ', payload);
      const { conversationSid } = payload;

      if (!conversationSid) {
        console.log('@@@ Not a chat, aborting...');
        return;
      }

      const {
        conversation: {
          source: {
            attributes: { customerPublicKey },
          },
        },
      } = payload;

      if (!customerPublicKey) {
        console.log('@@@ Not an E2E encrypted chat, aborting...');
        return;
      }

      // ohh, we cant set the message.attribute from this beforeSendMessage listener...
      // the only way to identify whether it is an encrypted message is adding this constant "@@@isEncrypted@@@" at the beginninng.
      // not elegant, but it is the only way.
      payload.body = '@@@isEncrypted@@@' + encrypt.encrypt(payload.conversationSid, payload.body);
    });

    flex.Actions.addListener('beforeAttachFile', async (payload, original) => {
      // console.log('@@@ beforeAttachFile ', payload);
      var encryptedFile = await encryptFile(payload.file, payload.conversationSid);
      payload.file = encryptedFile;
    });

    flex.Actions.replaceAction('DownloadMedia', async (payload, original) => {
      const contentUri = await payload.media.getContentTemporaryUrl();
      axios.get(contentUri).then((resp) => {
        const { body, wasEncrypted } = encrypt.decrypt(payload.conversationSid, resp.data);
        download(body, payload.media.filename);
      });
    });

    flex.MessageBubble.Content.replace(<DecryptMessageBubble key="decryptBubble" />, {
      // WebChat sends an attribute "isEncrypted: true" for every message sent
      if: (prop) => {
        // When the message came from WebChat
        if (prop.message.source && prop.message.source.attributes && prop.message.source.attributes.isEncrypted) {
          return true;
        }

        // When the message came from the Agent
        if (prop.message.source && prop.message.source.body && prop.message.source.body.includes('@@@isEncrypted@@@')) {
          return true;
        }

        return false;
      },
    });
  }
}
