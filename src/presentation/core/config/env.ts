import dotenv from "dotenv" ;
dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost:27017/myapp",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
  RESEND_API_KEY: required("RESEND_API_KEY"),
  MAIL_FROM: required("MAIL_FROM"),
  APP_INVITE_URL: required("APP_INVITE_URL"),
  // Deliberately NOT required(): an existing deployment without these must still boot.
  // RevenueCatProvider fails closed (rejects all webhooks) when REVENUECAT_WEBHOOK_AUTH is empty.
  REVENUECAT_WEBHOOK_AUTH: process.env.REVENUECAT_WEBHOOK_AUTH || "",
  REVENUECAT_API_KEY: process.env.REVENUECAT_API_KEY || "",
  // Test login for App Store / Google Play review. Deliberately NOT required(): a deployment
  // without these must still boot. The route is only mounted when TEST_LOGIN_ENABLED === "true".
  TEST_LOGIN_ENABLED: process.env.TEST_LOGIN_ENABLED === "true",
  TEST_LOGIN_EMAIL: process.env.TEST_LOGIN_EMAIL || "",
  TEST_LOGIN_PASSWORD: process.env.TEST_LOGIN_PASSWORD || "",
};

// Fail-fast (never fail-open): if the test-login route is enabled, its credentials must be
// present. A deployment with TEST_LOGIN_ENABLED=true and no credentials must not boot silently
// into a broken or, worse, wide-open review endpoint.
function validateTestLoginConfig(): void {
  if (!ENV.TEST_LOGIN_ENABLED) return;

  if (!ENV.TEST_LOGIN_EMAIL) {
    throw new Error("TEST_LOGIN_ENABLED is true but TEST_LOGIN_EMAIL is missing");
  }

  if (!ENV.TEST_LOGIN_PASSWORD) {
    throw new Error("TEST_LOGIN_ENABLED is true but TEST_LOGIN_PASSWORD is missing");
  }
}

validateTestLoginConfig();

export default ENV;