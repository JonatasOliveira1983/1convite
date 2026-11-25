import { b as private_env } from './shared-server-DaWdgxVh.js';
import { getDBSession, deleteDBSession, getUserByUsername, createDBSession, clearExpiredDBSessions, createUser } from './database-BjMeOB2B.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const ADMIN_USERNAME = private_env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = private_env.ADMIN_PASSWORD;
const WEAK_PASSWORDS = [
  "admin123",
  "admin",
  "password",
  "password123",
  "12345678",
  "123456789",
  "qwerty123",
  "abc123456",
  "senha123",
  "adminadmin",
  "root",
  "test",
  "demo",
  "welcome",
  "letmein",
  "iloveyou"
];
function validateAdminPasswordConfig() {
  if (!ADMIN_PASSWORD) {
    return {
      valid: false,
      error: "ADMIN_PASSWORD não está configurado no .env! Defina uma senha forte antes de rodar a aplicação."
    };
  }
  if (WEAK_PASSWORDS.includes(ADMIN_PASSWORD.toLowerCase())) {
    return {
      valid: false,
      error: `ADMIN_PASSWORD está usando uma senha fraca e comum ("${ADMIN_PASSWORD}"). Use uma senha forte e única!`
    };
  }
  const strength = validatePasswordStrength(ADMIN_PASSWORD);
  if (!strength.valid) {
    return {
      valid: false,
      error: `ADMIN_PASSWORD não atende os requisitos mínimos: ${strength.message}`
    };
  }
  if (ADMIN_PASSWORD.length < 12) {
    return {
      valid: false,
      error: "ADMIN_PASSWORD deve ter pelo menos 12 caracteres para produção."
    };
  }
  return { valid: true };
}
const passwordValidation = validateAdminPasswordConfig();
if (!passwordValidation.valid) {
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    console.error("❌ ERRO DE CONFIGURAÇÃO DE SEGURANÇA:");
    console.error(passwordValidation.error);
    console.error("A aplicação continuará executando, mas configure uma senha forte o quanto antes.");
  } else {
    console.warn("⚠️ AVISO DE CONFIGURAÇÃO DE SEGURANÇA (desenvolvimento):");
    console.warn(passwordValidation.error);
  }
}
const SALT_ROUNDS = 10;
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1e3;
function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}
async function createSession(username) {
  const token = generateSessionToken();
  const now = Date.now();
  const expiresAt = now + SESSION_DURATION_MS;
  await createDBSession(token, username, expiresAt);
  return token;
}
async function validateSession(token) {
  if (!token) return null;
  const session = await getDBSession(token);
  if (!session) return null;
  if (Date.now() > session.expires_at) {
    await deleteDBSession(token);
    return null;
  }
  return session.username;
}
async function destroySession(token) {
  await deleteDBSession(token);
}
function cleanExpiredSessions() {
  clearExpiredDBSessions();
}
if (typeof setInterval !== "undefined") {
  setInterval(cleanExpiredSessions, 30 * 60 * 1e3);
}
const loginAttempts = /* @__PURE__ */ new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1e3;
function checkRateLimit(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, waitSeconds: 0 };
  }
  if (now - entry.firstAttempt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, waitSeconds: 0 };
  }
  if (entry.count >= MAX_ATTEMPTS) {
    const waitSeconds = Math.ceil((WINDOW_MS - (now - entry.firstAttempt)) / 1e3);
    return { allowed: false, remaining: 0, waitSeconds };
  }
  entry.count++;
  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count, waitSeconds: 0 };
}
function resetRateLimit(ip) {
  loginAttempts.delete(ip);
}
function validatePasswordStrength(password) {
  if (password.length < 8) {
    return { valid: false, message: "A senha deve ter pelo menos 8 caracteres" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "A senha deve conter pelo menos uma letra maiúscula" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "A senha deve conter pelo menos uma letra minúscula" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "A senha deve conter pelo menos um número" };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: "A senha deve conter pelo menos um caractere especial (!@#$%^&*...)" };
  }
  if (/(.)\1{2,}/.test(password)) {
    return { valid: false, message: "A senha não deve conter 3 ou mais caracteres repetidos" };
  }
  const sequentialPatterns = ["123", "234", "345", "456", "567", "678", "789", "abc", "bcd", "cde", "def"];
  const lowerPassword = password.toLowerCase();
  for (const pattern of sequentialPatterns) {
    const regex = new RegExp(`(^${pattern}|${pattern}$|${pattern}(?=[^a-z0-9])|(?<=[^a-z0-9])${pattern})`, "i");
    if (regex.test(lowerPassword) && lowerPassword !== pattern) {
      return { valid: false, message: "A senha não deve conter sequências óbvias de caracteres" };
    }
  }
  return { valid: true, message: "Senha válida" };
}
async function verifyLogin(username, password) {
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      console.log(`[Auth] User not found: ${username}`);
      return false;
    }
    if (!user.password) {
      console.error(`[Auth] User ${username} found but has no password property! User object keys:`, Object.keys(user));
      return false;
    }
    if (typeof user.password !== "string") {
      console.error(`[Auth] User ${username} password is not a string! Type:`, typeof user.password);
      return false;
    }
    return await bcrypt.compare(password, user.password);
  } catch (error) {
    console.error(`[Auth] Error in verifyLogin for user ${username}:`, error);
    throw error;
  }
}
async function getUser(username) {
  return getUserByUsername(username);
}
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}
function getAdminCredentials() {
  return {
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD
  };
}
async function initAdminUser() {
  const validation = validateAdminPasswordConfig();
  if (!validation.valid) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("⚠️  Admin user inicializado com senha fraca (apenas para desenvolvimento)");
    }
    return;
  }
  const admin = await getUserByUsername(ADMIN_USERNAME);
  if (!admin) {
    const hashedPassword = await hashPassword(ADMIN_PASSWORD);
    await createUser(ADMIN_USERNAME, hashedPassword, "admin");
    console.log(`Usuário admin "${ADMIN_USERNAME}" criado com sucesso`);
  }
}

export { checkRateLimit, cleanExpiredSessions, createSession, destroySession, generateSessionToken, getAdminCredentials, getUser, hashPassword, initAdminUser, resetRateLimit, validatePasswordStrength, validateSession, verifyLogin };
//# sourceMappingURL=auth2-B20dP8z5.js.map
