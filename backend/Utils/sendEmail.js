import nodemailer from "nodemailer";
import { config } from "../Config/env.js";

let transporter;

const isEmailEnabled = () => {
  return (
    config.ENABLE_EMAIL_NOTIFICATIONS &&
    config.EMAIL_HOST &&
    config.EMAIL_PORT &&
    config.EMAIL_USER &&
    config.EMAIL_PASS &&
    config.EMAIL_FROM
  );
};

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.EMAIL_HOST,
      port: config.EMAIL_PORT,
      secure: config.EMAIL_SECURE,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
      },
    });
  }

  return transporter;
};

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!isEmailEnabled()) {
    return {
      sent: false,
      reason: "Email notifications are disabled or not configured",
    };
  }

  const mailer = getTransporter();

  await mailer.sendMail({
    from: config.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });

  return { sent: true };
};

export const sendAppointmentNotificationEmail = async ({
  to,
  recipientName,
  action,
  appointment,
}) => {
  const appointmentDate = new Date(appointment.date).toLocaleDateString();
  const subject = `Appointment ${action}`;
  const text = [
    `Hello ${recipientName || "there"},`,
    "",
    `Your appointment has been ${action}.`,
    `Date: ${appointmentDate}`,
    `Time: ${appointment.startTime} - ${appointment.endTime}`,
    `Status: ${appointment.status}`,
  ].join("\n");

  const html = `
		<div style="font-family: Arial, sans-serif; line-height: 1.6;">
			<p>Hello ${recipientName || "there"},</p>
			<p>Your appointment has been <strong>${action}</strong>.</p>
			<p>
				<strong>Date:</strong> ${appointmentDate}<br />
				<strong>Time:</strong> ${appointment.startTime} - ${appointment.endTime}<br />
				<strong>Status:</strong> ${appointment.status}
			</p>
		</div>
	`;

  return sendEmail({ to, subject, text, html });
};
