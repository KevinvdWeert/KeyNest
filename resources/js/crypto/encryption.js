/**
 * Client-side encryption using Web Crypto API
 * AES-GCM encryption with PBKDF2 key derivation
 */

const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const KEY_LENGTH = 256;
const ITERATIONS = 100000;

/**
 * Derive a cryptographic key from a master password
 */
async function deriveKey(masterPassword, salt) {
    const encoder = new TextEncoder();
    const passwordKey = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(masterPassword),
        'PBKDF2',
        false,
        ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: ITERATIONS,
            hash: 'SHA-256',
        },
        passwordKey,
        { name: 'AES-GCM', length: KEY_LENGTH },
        false,
        ['encrypt', 'decrypt']
    );
}

/**
 * Encrypt data with master password
 */
export async function encrypt(plaintext, masterPassword) {
    try {
        const encoder = new TextEncoder();
        const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
        const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
        
        const key = await deriveKey(masterPassword, salt);
        
        const encrypted = await window.crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv,
            },
            key,
            encoder.encode(plaintext)
        );

        const encryptedArray = new Uint8Array(encrypted);
        const combined = new Uint8Array(salt.length + iv.length + encryptedArray.length);
        combined.set(salt, 0);
        combined.set(iv, salt.length);
        combined.set(encryptedArray, salt.length + iv.length);

        return btoa(String.fromCharCode(...combined));
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
}

/**
 * Decrypt data with master password
 */
export async function decrypt(encryptedData, masterPassword) {
    try {
        const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
        
        const salt = combined.slice(0, SALT_LENGTH);
        const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
        const encrypted = combined.slice(SALT_LENGTH + IV_LENGTH);

        const key = await deriveKey(masterPassword, salt);

        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv,
            },
            key,
            encrypted
        );

        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data. Invalid password or corrupted data.');
    }
}

/**
 * Generate a random password
 */
export function generatePassword(length = 16) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    const randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset[randomValues[i] % charset.length];
    }
    
    return password;
}
