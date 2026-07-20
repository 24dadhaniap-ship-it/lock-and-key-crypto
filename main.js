/**
 * Lock & Key — Encode & Decode Studio Main Controller
 */

import { caesarEncrypt, caesarDecrypt, caesarExplainSteps, rot13 } from './js/ciphers/caesar.js';
import { generateRandomSubstitutionKey, substitutionEncrypt, substitutionDecrypt } from './js/ciphers/substitution.js';
import { vigenereEncrypt, vigenereDecrypt } from './js/ciphers/vigenere.js';
import { railFenceEncrypt, railFenceDecrypt } from './js/ciphers/transposition.js';
import { xorEncrypt, xorDecrypt, generateOneTimePadKey } from './js/ciphers/xor.js';
import { aesEncrypt, aesDecrypt } from './js/ciphers/aes_comparison.js';
import { rsaEncrypt, rsaDecrypt, TOY_RSA_KEYS } from './js/ciphers/rsa_demo.js';

import { validateInput } from './js/utils/validation.js';
import { evaluateKeyStrength } from './js/analysis/key_strength.js';
import { createEncryptedPackage } from './js/utils/integrity.js';
import { downloadFile, readFileAsText } from './js/utils/file_io.js';

import { renderTransformationVisualizer } from './js/ui/visualizer.js';
import { renderKeyStrengthMeter } from './js/ui/charts.js';

document.addEventListener('DOMContentLoaded', () => {
  // UI Elements
  const cipherSelect = document.getElementById('cipher-select');
  const keyLabel = document.getElementById('key-label');
  const keyInput = document.getElementById('key-input');
  const btnRandomKey = document.getElementById('btn-random-key');
  const inputText = document.getElementById('input-text');
  const resultOutput = document.getElementById('result-output');
  const errorAlertContainer = document.getElementById('error-alert-container');

  const btnEncrypt = document.getElementById('btn-encrypt');
  const btnDecrypt = document.getElementById('btn-decrypt');
  const btnCopyResult = document.getElementById('btn-copy-result');
  const btnExportFile = document.getElementById('btn-export-file');
  const btnLoadFile = document.getElementById('btn-load-file');
  const fileInput = document.getElementById('file-input');

  const keyStrengthContainer = document.getElementById('key-strength-container');
  const transformationContainer = document.getElementById('transformation-container');

  // 1. Algorithm Select Change Handler
  cipherSelect.addEventListener('change', () => {
    const alg = cipherSelect.value;
    errorAlertContainer.innerHTML = '';

    if (alg === 'caesar') {
      keyLabel.textContent = 'Shift Value (1-25)';
      keyInput.value = '7';
      keyInput.disabled = false;
    } else if (alg === 'rot13') {
      keyLabel.textContent = 'Shift Value (Fixed 13)';
      keyInput.value = '13';
      keyInput.disabled = true;
    } else if (alg === 'substitution') {
      keyLabel.textContent = '26-Letter Scrambled Alphabet Key';
      keyInput.value = generateRandomSubstitutionKey();
      keyInput.disabled = false;
    } else if (alg === 'vigenere') {
      keyLabel.textContent = 'Keyword (e.g. LEMON)';
      keyInput.value = 'LEMON';
      keyInput.disabled = false;
    } else if (alg === 'transposition') {
      keyLabel.textContent = 'Number of Rails (2-20)';
      keyInput.value = '3';
      keyInput.disabled = false;
    } else if (alg === 'xor') {
      keyLabel.textContent = 'Secret Key / Passphrase';
      keyInput.value = 'CipherKey123';
      keyInput.disabled = false;
    } else if (alg === 'otp') {
      keyLabel.textContent = 'One-Time Pad Key (Auto-Generated)';
      keyInput.value = generateOneTimePadKey(inputText.value.length || 10);
      keyInput.disabled = false;
    } else if (alg === 'aes') {
      keyLabel.textContent = 'AES Passphrase Key';
      keyInput.value = 'SuperSecretAESPassphrase!';
      keyInput.disabled = false;
    } else if (alg === 'rsa') {
      keyLabel.textContent = 'Toy RSA Public Key (e=17, n=3233)';
      keyInput.value = `(e=${TOY_RSA_KEYS.e}, n=${TOY_RSA_KEYS.n})`;
      keyInput.disabled = true;
    }

    updateKeyStrength();
  });

  // 2. Random Key Generator
  btnRandomKey.addEventListener('click', () => {
    const alg = cipherSelect.value;
    if (alg === 'caesar') {
      keyInput.value = Math.floor(Math.random() * 25) + 1;
    } else if (alg === 'substitution') {
      keyInput.value = generateRandomSubstitutionKey();
    } else if (alg === 'vigenere') {
      const words = ['SECRET', 'CRYPTO', 'CIPHER', 'MATRIX', 'LEMON', 'ANTIGRAVITY'];
      keyInput.value = words[Math.floor(Math.random() * words.length)];
    } else if (alg === 'transposition') {
      keyInput.value = Math.floor(Math.random() * 6) + 2;
    } else if (alg === 'xor' || alg === 'aes') {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let k = '';
      for (let i = 0; i < 16; i++) k += chars[Math.floor(Math.random() * chars.length)];
      keyInput.value = k;
    } else if (alg === 'otp') {
      keyInput.value = generateOneTimePadKey(inputText.value.length || 15);
    }
    updateKeyStrength();
  });

  function updateKeyStrength() {
    const strength = evaluateKeyStrength(keyInput.value, cipherSelect.value);
    renderKeyStrengthMeter(keyStrengthContainer, strength);
  }

  keyInput.addEventListener('input', updateKeyStrength);
  updateKeyStrength();

  // 3. Encode (Encrypt) Logic
  btnEncrypt.addEventListener('click', async () => {
    errorAlertContainer.innerHTML = '';
    const text = inputText.value;
    const alg = cipherSelect.value;
    const key = keyInput.value;

    const val = validateInput(text, alg, key);
    if (!val.valid) {
      errorAlertContainer.innerHTML = `<div class="alert-banner alert-danger">⚠️ ${val.error}</div>`;
      return;
    }

    try {
      let output = '';
      if (alg === 'caesar') {
        output = caesarEncrypt(text, key);
        const steps = caesarExplainSteps(text, key);
        renderTransformationVisualizer(transformationContainer, steps);
      } else if (alg === 'rot13') {
        output = rot13(text);
        const steps = caesarExplainSteps(text, 13);
        renderTransformationVisualizer(transformationContainer, steps);
      } else if (alg === 'substitution') {
        output = substitutionEncrypt(text, key);
        renderTransformationVisualizer(transformationContainer, []);
      } else if (alg === 'vigenere') {
        output = vigenereEncrypt(text, key);
        renderTransformationVisualizer(transformationContainer, []);
      } else if (alg === 'transposition') {
        output = railFenceEncrypt(text, key);
        renderTransformationVisualizer(transformationContainer, []);
      } else if (alg === 'xor' || alg === 'otp') {
        output = xorEncrypt(text, key);
        renderTransformationVisualizer(transformationContainer, []);
      } else if (alg === 'aes') {
        output = await aesEncrypt(text, key);
        renderTransformationVisualizer(transformationContainer, []);
      } else if (alg === 'rsa') {
        output = rsaEncrypt(text);
        renderTransformationVisualizer(transformationContainer, []);
      }

      resultOutput.textContent = output;
    } catch (err) {
      errorAlertContainer.innerHTML = `<div class="alert-banner alert-danger">⚠️ Error: ${err.message}</div>`;
    }
  });

  // 4. Decode (Decrypt) Logic
  btnDecrypt.addEventListener('click', async () => {
    errorAlertContainer.innerHTML = '';
    const text = inputText.value;
    const alg = cipherSelect.value;
    const key = keyInput.value;

    const val = validateInput(text, alg, key);
    if (!val.valid) {
      errorAlertContainer.innerHTML = `<div class="alert-banner alert-danger">⚠️ ${val.error}</div>`;
      return;
    }

    try {
      let output = '';
      if (alg === 'caesar') {
        output = caesarDecrypt(text, key);
      } else if (alg === 'rot13') {
        output = rot13(text);
      } else if (alg === 'substitution') {
        output = substitutionDecrypt(text, key);
      } else if (alg === 'vigenere') {
        output = vigenereDecrypt(text, key);
      } else if (alg === 'transposition') {
        output = railFenceDecrypt(text, key);
      } else if (alg === 'xor' || alg === 'otp') {
        output = xorDecrypt(text, key);
      } else if (alg === 'aes') {
        output = await aesDecrypt(text, key);
      } else if (alg === 'rsa') {
        output = rsaDecrypt(text);
      }

      resultOutput.textContent = output;
      renderTransformationVisualizer(transformationContainer, []);
    } catch (err) {
      errorAlertContainer.innerHTML = `<div class="alert-banner alert-danger">⚠️ Decryption Error: ${err.message}</div>`;
    }
  });

  // 5. Copy Result
  btnCopyResult.addEventListener('click', () => {
    const text = resultOutput.textContent;
    if (text && text !== 'Result will appear here...') {
      navigator.clipboard.writeText(text);
      btnCopyResult.textContent = '✓ Copied!';
      setTimeout(() => (btnCopyResult.textContent = '📋 Copy'), 2000);
    }
  });

  // 6. File Export & Import
  btnExportFile.addEventListener('click', async () => {
    const text = resultOutput.textContent;
    if (!text || text === 'Result will appear here...') return;
    const pkg = await createEncryptedPackage(inputText.value, text, cipherSelect.value, keyInput.value);
    downloadFile(`encoded_${cipherSelect.value}_payload.json`, JSON.stringify(pkg, null, 2), 'application/json');
  });

  btnLoadFile.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const content = await readFileAsText(file);
      if (file.name.endsWith('.json')) {
        const pkg = JSON.parse(content);
        if (pkg.ciphertext) {
          inputText.value = pkg.ciphertext;
          if (pkg.algorithm) cipherSelect.value = pkg.algorithm;
        }
      } else {
        inputText.value = content;
      }
    } catch (err) {
      alert('Error loading file: ' + err.message);
    }
  });
});
