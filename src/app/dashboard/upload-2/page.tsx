// Function to generate a sample CryptoKey (AES-GCM key in this case)
async function generateSampleKey() {
  return await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

// Function to export a CryptoKey to raw format
async function exportCryptoKey(key) {
  return await window.crypto.subtle.exportKey("raw", key);
}

// Function to import the public key
async function importPublicKey(pemKey) {
  // Remove PEM header and footer and decode base64
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = pemKey.substring(
    pemHeader.length,
    pemKey.length - pemFooter.length
  );
  const binaryDer = window.atob(pemContents);
  const derBuffer = new Uint8Array(binaryDer.length);
  for (let i = 0; i < binaryDer.length; i++) {
    derBuffer[i] = binaryDer.charCodeAt(i);
  }

  // Import the key
  return await window.crypto.subtle.importKey(
    "spki",
    derBuffer,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    true,
    ["encrypt"]
  );
}

// Function to encrypt the exported key
async function encryptKey(publicKey, keyToEncrypt) {
  const encryptedKey = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP"
    },
    publicKey,
    keyToEncrypt
  );
  return new Uint8Array(encryptedKey);
}

// Function to decrypt the encrypted key (for demonstration)
async function decryptKey(privateKey, encryptedKey) {
  return await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP"
    },
    privateKey,
    encryptedKey
  );
}

// Function to re-import the decrypted key
async function reimportKey(decryptedKeyBuffer) {
  return await window.crypto.subtle.importKey(
    "raw",
    decryptedKeyBuffer,
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
}

// Main function to demonstrate the process
async function encryptCryptoKey(publicKeyPem) {
  try {
    // Generate a sample CryptoKey
    const sampleKey = await generateSampleKey();
    console.log("Sample CryptoKey generated");

    // Export the CryptoKey
    const exportedKey = await exportCryptoKey(sampleKey);
    console.log("CryptoKey exported");

    // Import the public key
    const publicKey = await importPublicKey(publicKeyPem);
    console.log("Public key imported");

    // Encrypt the exported key
    const encryptedKey = await encryptKey(publicKey, exportedKey);
    console.log("CryptoKey encrypted", encryptedKey);

    // The encryptedKey can now be safely stored or transmitted

    return encryptedKey;
  } catch (error) {
    console.error("Error in encryptCryptoKey:", error);
  }
}

// Usage
const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END PUBLIC KEY-----`;

encryptCryptoKey(publicKeyPem).then(encryptedKey => {
  console.log("Encrypted key:", encryptedKey);
  // You can now store or transmit this encryptedKey
});

// Decryption and re-import (for demonstration, normally done separately)
async function decryptAndReimportKey(privateKey, encryptedKey) {
  const decryptedKeyBuffer = await decryptKey(privateKey, encryptedKey);
  const reimportedKey = await reimportKey(decryptedKeyBuffer);
  console.log("Key decrypted and re-imported successfully");
  return reimportedKey;
}