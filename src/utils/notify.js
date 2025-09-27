const admin = require("firebase-admin");

if (!admin.apps.length) {
  // Parse the JSON from environment variable
  const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

  // ✅ Replace escaped \n with real newlines
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

  // Initialize Firebase Admin
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase Admin initialized");
}

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

module.exports = { sendNotification };
