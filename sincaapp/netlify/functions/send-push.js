const webpush = require('web-push');

const VAPID_PUBLIC_KEY = "BInjsIezzRJXQfR5PLESbpRHYCuvn_D5ClD3gkLNl5AMwwXBBd8X8SgyKauiJaswKahWdDMCBcXJS91Jjewslnw";
const VAPID_PRIVATE_KEY = "XGVdt8rVy8hYzggWlA7Gdxr-bGooU_b5Ldqk-zVq8LI";

webpush.setVapidDetails(
  "mailto:sincap@example.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  try {
    const { subscription, title, body, icon, tag } = JSON.parse(event.body);
    if (!subscription) {
      return { statusCode: 400, body: "subscription gerekli" };
    }
    const payload = JSON.stringify({
      title: title || "Sincap",
      body: body || "",
      icon: icon || "icon-180.png",
      tag: tag || "sincap"
    });
    await webpush.sendNotification(subscription, payload);
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(err) }) };
  }
};
