const fs = require("node:fs");
const path = require("node:path");

const fallbackApiUrl = "https://traveldesk-api-production.up.railway.app/api/v1";

function normalizeApiUrl(input) {
  if (!input?.trim()) {
    return fallbackApiUrl;
  }

  let value = input.trim();

  // Accept values like "travelagent.up.railway.app" and prepend HTTPS.
  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`;
  }

  // Remove trailing slash for stable concatenation.
  value = value.replace(/\/+$/, "");

  // If user provided only host (or host + custom base), ensure API suffix exists.
  if (!/\/api\/v1$/i.test(value)) {
    value = `${value}/api/v1`;
  }

  return value;
}

const resolvedApiUrl = normalizeApiUrl(process.env.SPRING_PUBLIC_API_URL);
const targetFile = path.join(__dirname, "..", "src", "environments", "environment.production.ts");

const fileContent = `export const environment = {
  production: true,
  apiUrl: "${resolvedApiUrl}",
  exchangeRateApiUrl: "https://api.exchangerate-api.com/v4/latest/USD",
};
`;

fs.writeFileSync(targetFile, fileContent, "utf8");
console.log(`[prepare-env] environment.production.ts -> ${resolvedApiUrl}`);
