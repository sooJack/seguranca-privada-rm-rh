import dotenv from 'dotenv';
dotenv.config();

import { testConnection, isFallback } from './server/database.js';

(async () => {
  try {
    const ok = await testConnection();
    console.log('✅ testConnection returned:', ok);
    console.log('ℹ️ isFallback():', isFallback());
    process.exit(0);
  } catch (err) {
    console.error('❌ testConnection erro:', err);
    process.exit(1);
  }
})();
