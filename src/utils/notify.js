const admin = require("firebase-admin");

if (!admin.apps.length) {
  try {
    // Parse service account from environment variable
    const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase Admin initialized");
  } catch (err) {
    console.error("❌ Failed to initialize Firebase Admin", err);
  }
}

async function sendNotification(tokens, { title, body, data }) {
  if (!tokens || tokens.length === 0) {
    console.log("⚠️ No tokens to send");
    return;
  }

  const message = {
    notification: { title, body },
    data: data || {},
    tokens, // multicast
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log("✅ Notification sent:", response);
    return { success: true, response };
  } catch (err) {
    console.error("❌ Error sending notification:", err);
    return { success: false, error: err };
  }
}

module.exports = { sendNotification };

