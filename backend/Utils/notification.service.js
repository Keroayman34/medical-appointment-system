import { Notification } from "../Database/Models/notification.model.js";
import { sendAppointmentNotificationEmail } from "./sendEmail.js";

const ACTION_CONTENT = {
  booked: {
    type: "appointment_booked",
    title: "Appointment booked",
    verb: "booked",
  },
  cancelled: {
    type: "appointment_cancelled",
    title: "Appointment cancelled",
    verb: "cancelled",
  },
  rescheduled: {
    type: "appointment_rescheduled",
    title: "Appointment rescheduled",
    verb: "rescheduled",
  },
  consultation_notes_added: {
    type: "consultation_notes_added",
    title: "Consultation notes added",
    verb: "updated",
  },
};

const buildActionContent = ({ action, status }) => {
  if (action === "status_updated") {
    return {
      type: "appointment_status_updated",
      title: "Appointment status updated",
      verb: `updated to ${status || "new status"}`,
    };
  }

  return (
    ACTION_CONTENT[action] || {
      type: "general",
      title: "Appointment notification",
      verb: "updated",
    }
  );
};

const formatDate = (dateValue) => {
  return new Date(dateValue).toLocaleDateString();
};

const buildMessage = ({ recipientName, appointment, verb }) => {
  return [
    `Hello ${recipientName || "there"},`,
    `Your appointment was ${verb}.`,
    `Date: ${formatDate(appointment.date)}`,
    `Time: ${appointment.startTime} - ${appointment.endTime}`,
    `Status: ${appointment.status}`,
  ].join(" ");
};

const createNotificationRecord = async ({
  recipientUserId,
  type,
  title,
  message,
  appointmentId,
  metadata,
}) => {
  return Notification.create({
    recipient: recipientUserId,
    type,
    title,
    message,
    appointment: appointmentId || null,
    metadata: metadata || {},
    emailStatus: "pending",
  });
};

const updateEmailResult = async ({ notificationId, result, error }) => {
  if (result?.sent) {
    await Notification.findByIdAndUpdate(notificationId, {
      emailStatus: "sent",
      emailSentAt: new Date(),
      emailError: "",
    });
    return;
  }

  const reason = error?.message || result?.reason || "Email not sent";
  const status = result?.reason ? "skipped" : "failed";

  await Notification.findByIdAndUpdate(notificationId, {
    emailStatus: status,
    emailError: reason,
  });
};

export const notifyAppointmentParticipants = async ({
  appointment,
  action,
  status,
}) => {
  const content = buildActionContent({ action, status });

  const recipients = [
    {
      userId: appointment.patient?.user?._id,
      name: appointment.patient?.user?.name,
      email: appointment.patient?.user?.email,
      role: "patient",
    },
    {
      userId: appointment.doctor?.user?._id,
      name: appointment.doctor?.user?.name,
      email: appointment.doctor?.user?.email,
      role: "doctor",
    },
  ].filter((entry) => entry.userId);

  for (const recipient of recipients) {
    const message = buildMessage({
      recipientName: recipient.name,
      appointment,
      verb: content.verb,
    });

    const notification = await createNotificationRecord({
      recipientUserId: recipient.userId,
      type: content.type,
      title: content.title,
      message,
      appointmentId: appointment._id,
      metadata: {
        action,
        role: recipient.role,
        status: appointment.status,
      },
    });

    if (!recipient.email) {
      await updateEmailResult({
        notificationId: notification._id,
        result: { sent: false, reason: "Recipient email not available" },
      });
      continue;
    }

    try {
      const emailResult = await sendAppointmentNotificationEmail({
        to: recipient.email,
        recipientName: recipient.name,
        action: content.verb,
        appointment,
      });

      await updateEmailResult({
        notificationId: notification._id,
        result: emailResult,
      });
    } catch (error) {
      await updateEmailResult({
        notificationId: notification._id,
        error,
      });
    }
  }
};
