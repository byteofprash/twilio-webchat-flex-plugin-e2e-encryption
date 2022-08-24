import { MessageBuilder } from "@twilio/conversations";
import { encrypt } from "./naclForFlexPlugins";

function convertBase64ToBlob(base64Image: string) {
  // Split into two parts
  const parts = base64Image.split(';base64,');

  // Hold the content type
  const imageType = parts[0].split(':')[1];

  // Decode Base64 string
  const decodedData = window.atob(parts[1]);

  // Create UNIT8ARRAY of size same as row data length
  const uInt8Array = new Uint8Array(decodedData.length);

  // Insert all character code into uInt8Array
  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i);
  }

  // Return BLOB image after conversion
  return new Blob([uInt8Array], { type: imageType });
}

const toBase64 = async (file: File): Promise<string | ArrayBuffer | null> =>  new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function download(content: string, filename: string){
  var a = document.createElement('a')
  var blob = convertBase64ToBlob(content)
  var url = URL.createObjectURL(blob)
  a.setAttribute('href', url)
  a.setAttribute('download', filename)
  a.click()
}

async function encryptFile(attachedFile: File, chSid: string) {
    const data = await toBase64(attachedFile);
    if (typeof data === "string") {
      const encryptedFileText = encrypt.encrypt(chSid, data);
      const encryptedFile = new Blob([encryptedFileText], { type: attachedFile.type });
      return new File([encryptedFile], attachedFile.name, {type: attachedFile.type})
    }
}

export {download, encryptFile}
