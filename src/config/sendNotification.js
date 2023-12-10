// sendNotification.js

import axios from "axios";

async function sendNotification(fcmToken, notificationBody) {
  const serverKey =
    "AAAAk6KA5QU:APA91bHRvSY8vT9UbqAx5G_pFd7_KGiB9tpEtrUPCnm8cWl0285GrfaD_TU8xDnQ2FuSV6CxLU6gQnZNAydB0nqvWYdLrSK3OM6LBsvNtisGITp1J2qRmBouoy0Fcl8yf_zyRpjbjqJD";
  const endpoint = "https://fcm.googleapis.com/fcm/send";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `key=${serverKey}`,
  };

  const message = {
    to: fcmToken,
    notification: {
      title: "New Notification",
      body: notificationBody,
    },
  };

  try {
    await axios.post(endpoint, message, { headers });
    console.log("Notification sent successfully!");
  } catch (error) {
    console.error("Error sending notification:", error.message);
  }
}

module.exports = sendNotification;
