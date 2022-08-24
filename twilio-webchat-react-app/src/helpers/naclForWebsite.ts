import { decodeBase64, encodeBase64 } from "tweetnacl-util";
import { box } from "tweetnacl";
import { NaclBase } from "./naclBase";

const STORAGE_KEY = "e2e-key";

class NaclForWebsite extends NaclBase {
    initFromLocalStorage = () => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            console.warn("@@@ priv keys are not set for this channel");
            return undefined;
        }
        const { publicKey, secretKey, otherPartyPublicKey } = JSON.parse(data);

        if (!secretKey) {
            return undefined;
        }

        this.keyPair.publicKey = decodeBase64(publicKey);
        this.keyPair.secretKey = decodeBase64(secretKey);

        if (otherPartyPublicKey) {
            this.init(otherPartyPublicKey);
        }
        return otherPartyPublicKey;
    };

    save = (otherPartyPublicKey?: string) => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                otherPartyPublicKey,
                publicKey: encodeBase64(this.keyPair.publicKey),
                secretKey: encodeBase64(this.keyPair.secretKey)
            })
        );
    };

    init = (otherPartyPublicKey: string) => {
        const otherPartyPublicKeyAsUInt8 = decodeBase64(otherPartyPublicKey);
        this.secretOrSharedKey = box.before(otherPartyPublicKeyAsUInt8, this.keyPair.secretKey);

        this.save(otherPartyPublicKey);
    };

    cleanup = () => {
        localStorage.removeItem(STORAGE_KEY);
    };
}
export const encrypt = new NaclForWebsite();
