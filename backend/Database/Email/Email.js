import { sendEmail } from "../../Utils/sendEmail.js";

export default async function sendLegacyEmailNotification(email) {
  return sendEmail({
    to: email,
    subject: "Notification",
    text: "You have a new notification from Medical Appointment System.",
    html: "<p>You have a new notification from Medical Appointment System.</p>",
  });
}
