import crypto from "crypto";
const ALGORYTHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY || '', "hex");
const IV_LENGTH = 12;

if(KEY.length !== 32)
{
    throw new Error('Longitud de bytes incorrecta!');
}

export function encrypt (text:string):string{

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORYTHM, KEY, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decrypt (encryptedText:string):string{
    const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
    if(!ivHex || !authTagHex || !encrypted) {
        throw new Error('Formato de texto cifrado inválido!');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORYTHM, KEY, iv);

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}