# 🔐 Lock & Key — Text Encryption, Decryption & Cryptanalysis Suite

A web application designed for learning the core fundamentals of cryptography. Implements classical ciphers (Caesar, Monoalphabetic Substitution, Vigenère, Rail Fence Transposition), bitwise ciphers (XOR & One-Time Pad), real-world modern symmetric standards (AES-256 GCM), asymmetric key concepts (Toy RSA), cryptanalysis tools (Caesar Brute-Force Cracker, Frequency Analysis, Index of Coincidence), and SHA-256 integrity tamper verification.

---

## 🚀 Key Features

1. **Multi-Cipher Encryption Studio**:
   - **Caesar Cipher** & **ROT13**: Modular arithmetic shift cipher with case preservation.
   - **Monoalphabetic Substitution**: Scrambled 26-letter substitution alphabet with random key generation.
   - **Vigenère Cipher**: Polyalphabetic substitution using a repeating keyword.
   - **Rail Fence Transposition**: Multi-rail zigzag permutation.
   - **XOR Cipher & One-Time Pad**: Byte-level XOR operating on text with Base64 output, plus an unbreakable One-Time Pad mode.
   - **AES-256 GCM**: Modern authenticated symmetric encryption via the Web Crypto API (`crypto.subtle`).
   - **Toy RSA**: Educational asymmetric prime factorization cipher simulation ($p=61, q=53$).

2. **Interactive Character Visualizer**:
   - Step-by-step ASCII breakdown showing character shifts (e.g. `'A'` + 7 -> `'H'`).

3. **Cryptanalysis & Attack Lab**:
   - **Caesar Brute-Force Cracker**: Automatically tests all 25 shift keys in parallel, scores plaintexts using English letter frequency heuristics, and highlights top candidates.
   - **Frequency Analysis Tool**: Computes letter distribution histograms and overlays them against standard English language averages (`ETAOIN SHRDLU`).
   - **Index of Coincidence (IoC)**: Statistical analysis to estimate Vigenère keyword lengths.

4. **Data Integrity & Tamper Demo**:
   - Generates SHA-256 cryptographic checksums for encrypted payloads.
   - Includes a **Simulate Tamper** button that flips bits in transit and verifies that decryption/checksum fails.

5. **Key Management & Entropy Meter**:
   - Real-time mathematical entropy calculation (bits) and brute-force crack time estimates.

6. **In-Browser Automated Test Suite**:
   - Interactive unit test runner asserting round-trip correctness ($decrypt(encrypt(m, k), k) == m$) across all ciphers and edge cases.

---

## 📖 Core Cryptography Concepts

### Encoding vs. Encryption vs. Hashing
- **Encoding** (e.g. Base64) transforms data format for transport compatibility (e.g. converting raw binary XOR bytes to printable ASCII). It uses **no secret key** and provides **no security**.
- **Encryption** transforms plaintext into ciphertext using a secret key. It is designed for **confidentiality** and is reversible only with the correct key.
- **Hashing** (e.g. SHA-256) converts input into a fixed-length unique fingerprint. It is **one-way** (irreversible) and designed for **integrity verification**.

### Symmetric vs. Asymmetric Encryption
- **Symmetric Encryption**: The same key locks and unlocks data (Caesar, Vigenère, XOR, AES). Highly efficient, but requires pre-sharing the secret key securely.
- **Asymmetric Encryption**: Uses a key pair—a **Public Key** to encrypt and a **Private Key** to decrypt (RSA, ECC). Solves key distribution over public networks like HTTPS.

---

## 🧠 Reflection Answers (Project Brief Section 9)

1. **Which cipher was easiest to break, and why?**  
   *The Caesar cipher is the easiest to break because its key space is limited to only 25 possible shifts. A computer can evaluate all 25 shifts instantaneously and score candidate plaintexts using letter-frequency heuristics.*

2. **If you doubled your Caesar cipher's key space (e.g., shift up to 50), would it actually be twice as hard to crack?**  
   *No. Doubling key space from 25 to 50 increases cracking time from ~0.01 ms to ~0.02 ms, which is still virtually instantaneous for modern hardware.*

3. **What happens if you use the same XOR key twice for two different messages? (Two-Time Pad)**  
   *If $C_1 = P_1 \oplus K$ and $C_2 = P_2 \oplus K$, then $C_1 \oplus C_2 = P_1 \oplus P_2$. The key $K$ completely cancels out, allowing an attacker to reconstruct both original messages using crib dragging techniques.*

4. **Why do modern systems (like HTTPS) combine asymmetric and symmetric encryption?**  
   *Asymmetric encryption (RSA/ECC) is computationally heavy, while symmetric encryption (AES) is extremely fast. HTTPS uses asymmetric encryption during the initial handshake to exchange a temporary symmetric key (Session Key), then switches to AES for fast data transfer.*

5. **What is your advice on password strength based on brute-force cracking?**  
   *Password length and character entropy matter exponentially more than simple character substitutions. Short passwords like "1234" have tiny key spaces. Long passphrases (16+ characters with mixed case, numbers, and symbols) create key spaces with over 128 bits of entropy, rendering brute-force attacks computationally infeasible.*

---

## 🛠️ Project File Layout

```
g2/
├── index.html                   # HTML5 layout & UI tabs
├── style.css                    # Dark glassmorphism & cyber design system
├── main.js                      # Main application controller & event bindings
├── js/
│   ├── ciphers/
│   │   ├── caesar.js            # Caesar cipher & ROT13 engine
│   │   ├── substitution.js      # Monoalphabetic substitution engine
│   │   ├── vigenere.js          # Vigenère polyalphabetic cipher engine
│   │   ├── transposition.js     # Rail Fence transposition engine
│   │   ├── xor.js               # XOR & One-Time Pad engine
│   │   ├── aes_comparison.js    # Modern Web Crypto API AES-256 GCM engine
│   │   └── rsa_demo.js          # Toy RSA asymmetric encryption simulation
│   ├── analysis/
│   │   ├── brute_force.js       # Caesar 25-shift brute force cracker
│   │   ├── frequency.js         # Letter frequency distribution analyzer
│   │   ├── index_coincidence.js # Index of Coincidence calculator
│   │   └── key_strength.js      # Key entropy & brute-force time meter
│   ├── utils/
│   │   ├── base64.js            # Base64 & UTF-8 conversion helpers
│   │   ├── file_io.js           # File upload/download exporter
│   │   ├── integrity.js         # SHA-256 checksum & tamper demo
│   │   └── validation.js        # Input sanitization & error handlers
│   ├── ui/
│   │   ├── visualizer.js        # Step-by-step character visualizer
│   │   └── charts.js            # Frequency charts & key strength meter
│   └── tests/
│       └── runner.js            # In-browser automated unit test runner
└── README.md                    # Project documentation & reflections
```

---

## ⚠️ Safety & Scope Disclaimer

This tool is created strictly for **educational and learning purposes**. Classical ciphers (Caesar, Substitution, Vigenère, Rail Fence, basic XOR with reused keys) are historically interesting but insecure against modern cryptanalysis. For real-world security, always rely on standard, audited cryptographic libraries implementing modern algorithms like **AES-256-GCM** or **ChaCha20-Poly1305**.
