const admin = require("firebase-admin");

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

  // ✅ Fix escaped newlines in private key
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase Admin initialized");
}

async function sendNotification(tokens, { title, body, data }) {
  if (!tokens || tokens.length === 0) {
    console.warn("⚠️ No tokens to send notification");
    return { success: false };
  }

  const message = {
    notification: { title, body },
    data: data || {},
    tokens: Array.isArray(tokens) ? tokens : [tokens],
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log("✅ Notification sent:", response.successCount);
    return { success: true, response };
  } catch (err) {
    console.error("❌ Error sending notification:", err);
    return { success: false, error: err };
  }
}

module.exports = { sendNotification };

