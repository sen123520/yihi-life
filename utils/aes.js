import CryptoJS from "crypto-js";

// const key = CryptoJS.enc.Utf8.parse("8025c5ce627a1b67"); //16位十六进制数作为密钥
// const iv = CryptoJS.enc.Utf8.parse("32c88a91ef4b2eaf"); //16位十六进制数作为密钥偏移量

//解密方法
export function aesDecrypt(word, random) {
  const key = CryptoJS.enc.Utf8.parse(random); //16位十六进制数作为密钥
  let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    // iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

//加密方法
export function aesEncrypt(word, random) {
  const key = CryptoJS.enc.Utf8.parse(random); //16位十六进制数作为密钥
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    // iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString().toUpperCase();
}

