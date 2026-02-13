import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'very_secret_key_32_chars_long_!!'; // Should be 32 bytes

export const encrypt = (text) => {
    if (!text) return text;
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
};

export const decrypt = (encryptedText) => {
    if (!encryptedText || !encryptedText.includes(':')) return encryptedText;

    const [ivHex, tagHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};
