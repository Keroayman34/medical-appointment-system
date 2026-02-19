import  {template} from "./emailTemplate.js";
import  jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export default async function sendEmail(email){
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: "noteappmearn26@gmail.com",
    pass: "dsbq xhvy bxnt vzkl",
  },
});
    const emailToken = jwt.sign(email, "myEmail")

  const info = await transporter.sendMail({
    from: '"Hello From Note App We Are The Note APP Team from Intake 46 " <noteappmearn26@gmail.com>',
    to: email,
    subject: "Hello ✔",
    text: "Hello world? We Are The Note APP Team from Intake 46", 
    html: template(emailToken), 
  });

  console.log("Message sent:", info.messageId);
}