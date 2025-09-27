const admin = require("firebase-admin");

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

  // ✅ Fix private key newlines
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase Admin initialized");
}

/**
 * Send notification to a single device token
 */
async function sendNotification(token, { title, body, data }) {
  const message = {
    notification: { title, body },
    data: data || {},
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ Notification sent:", response);
    return { success: true, response };
  } catch (err) {
    console.error("❌ Error sending notification:", err);
    return { success: false, error: err };
  }
}

/**
 * Send notification to multiple device tokens
 */
async function sendNotificationToMany(tokens, { title, body, data }) {
  if (!Array.isArray(tokens) || tokens.length === 0) {
    return { success: false, error: "No tokens provided" };
  }

  const message = {
    notification: { title, body },
    data: data || {},
    tokens,
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log("✅ Notifications sent:", response.successCount, "successful");
    return { success: true, response };
  } catch (err) {
    console.error("❌ Error sending notifications:", err);
    return { success: false, error: err };
  }
}

module.exports = { sendNotification, sendNotificationToMany };
