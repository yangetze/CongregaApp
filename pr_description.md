🔒 Restrict overly permissive CORS configuration

🎯 **What:** The previous CORS configuration (`app.use(cors())`) used default settings which implicitly allow all origins (`*`). This was changed to restrict requests only to trusted domains specified by the `CORS_ORIGIN` environment variable, defaulting to `http://localhost:5173`.

⚠️ **Risk:** Allowing all origins with an overly permissive CORS setup makes the API vulnerable to cross-origin attacks such as CSRF (Cross-Site Request Forgery) or unauthorized access to endpoints from malicious or unrelated third-party websites, which could put sensitive data at risk.

🛡️ **Solution:** Passed a configuration object to the `cors` middleware (`{ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }`) to strictly limit the allowed origins to recognized clients. Also added corresponding unit tests under `backend/tests/security/cors.test.ts`.
