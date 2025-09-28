// utils/pusher.js
const PushNotifications = require("@pusher/push-notifications-server");

const beamsClient = new PushNotifications({
  instanceId: process.env.PUSHER_INSTANCE_ID,  // Your Beams Instance ID
  secretKey: process.env.PUSHER_SECRET_KEY,   // Your Beams Secret Key
});

module.exports = beamsClient;
