import { box, randomBytes } from "tweetnacl";
import { decodeUTF8, encodeUTF8, encodeBase64, decodeBase64 } from "tweetnacl-util";

export class NaclBase {
    secretOrSharedKey?: Uint8Array;

    keyPair = box.keyPair();

    constructor(otherPartyPublicKey?: string) {
        otherPartyPublicKey && this.init(otherPartyPublicKey);
    }

    private newNonce = () => randomBytes(box.nonceLength);

    init = (otherPartyPublicKey: string) => {
        const otherPartyPublicKeyAsUInt8 = decodeBase64(otherPartyPublicKey);
        this.secretOrSharedKey = box.before(otherPartyPublicKeyAsUInt8, this.keyPair.secretKey);
    };

    myPublicKey = () => {
        return encodeBase64(this.keyPair.publicKey);
    };

    encrypt = (msg: string) => {
        const nonce = this.newNonce();
        const messageUint8 = decodeUTF8(msg);
        const encrypted = box.after(messageUint8, nonce, this.secretOrSharedKey!);
        const fullMessage = new Uint8Array(nonce.length + encrypted.length);
        fullMessage.set(nonce);
        fullMessage.set(encrypted, nonce.length);
        return encodeBase64(fullMessage);
    };

    decrypt = (messageWithNonce: string) => {
        try {
            const bodyWithoutIdentifier = messageWithNonce.replace("@@@isEncrypted@@@", "");
            const messageWithNonceAsUint8Array = decodeBase64(bodyWithoutIdentifier);
            const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
            const message = messageWithNonceAsUint8Array.slice(box.nonceLength, bodyWithoutIdentifier.length);
            const decrypted = box.open.after(message, nonce, this.secretOrSharedKey!);

            if (!decrypted) {
                console.warn("@@@ Could not decrypt message: ", messageWithNonce, messageWithNonce);
                return { body: messageWithNonce, wasEncrypted: false };
            }

            return { body: encodeUTF8(decrypted), wasEncrypted: true };
        } catch (e) {
            console.warn("@@@ Could not decrypt message: ", messageWithNonce, e);
            return { body: messageWithNonce, wasEncrypted: false };
        }
    };
}
