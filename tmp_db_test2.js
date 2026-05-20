import { testConnection } from "./server/database.js";
(async ()=>{
 try {
   const ok = await testConnection();
   console.log("testConnection result:", ok);
 } catch(e) {
   console.error("error:", e);
 }
})();