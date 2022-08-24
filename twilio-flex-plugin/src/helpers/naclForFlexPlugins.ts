import { PrivateTaskHelper } from '@twilio/flex-ui/src/TaskHelper';
import { decodeBase64 } from 'tweetnacl-util';
import { NaclBase } from './naclBase';

const STORAGE_KEY = 'e2e-keys';

interface Channels {
  [key: string]: NaclBase;
}
class ChannelEncrypt {
  channels: Channels = {};
  constructor() {}

  init = (chSid: string, otherPartyPublicKey: string) => {
    // console.log('@@@ ChannelEncrypt init - chSid: ', chSid);
    this.channels[chSid] = new NaclBase({ otherPartyPublicKey });
    this.save(chSid, otherPartyPublicKey);
  };

  /**
   * Save on localStorage in case the agent restart the browser or his/her computer
   */
  private save(chSid: string, otherPartyPublicKey: string) {
    const publicKey = this.channels[chSid].myPublicKey();
    const secretKey = this.channels[chSid].mySecretKey();
    const name = `${STORAGE_KEY}-${chSid}`;
    localStorage.setItem(name, JSON.stringify({ publicKey, secretKey, otherPartyPublicKey }));
  }

  /**
   * If the agent restarts the browser or his/her computer,
   * the init() function won't be called because the task was accepted before
   * so this is a fallback to rescure the keys from localStorage
   */
  private load = (chSid: string, cb: Function, originalEncryptedBody?: string) => {
    if (this.channels[chSid]) {
      return cb();
    }

    const name = `${STORAGE_KEY}-${chSid}`;
    const data = localStorage.getItem(name);
    if (!data) {
      console.error(
        `@@@ Failed to run e2e encryption logic for chSid ${chSid}: Data is not within the localStorage nor within the object "this.channels", aborting...`
      );
      return { body: originalEncryptedBody, wasEncrypted: false };
    }
    const { publicKey, secretKey, otherPartyPublicKey } = JSON.parse(data);

    this.channels[chSid] = new NaclBase({
      keyPair: {
        publicKey: decodeBase64(publicKey),
        secretKey: decodeBase64(secretKey),
      },
      otherPartyPublicKey,
    });
    return cb();
  };

  destroy = (chSid: string) => delete this.channels[chSid];

  encrypt = (chSid: string, msg: string) => this.load(chSid, () => this.channels[chSid].encrypt(msg));
  decrypt = (chSid: string, msg: string) => this.load(chSid, () => this.channels[chSid].decrypt(msg), msg);
  myPublicKey = (chSid: string) => this.load(chSid, () => this.channels[chSid].myPublicKey());
}

export const encrypt = new ChannelEncrypt();
