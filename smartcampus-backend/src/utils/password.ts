import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

/**
 * Password hashing helpers — ready for auth implementation.
 */
export const passwordService = {
  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, SALT_ROUNDS);
  },

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  },
};
