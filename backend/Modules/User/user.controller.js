import User from "../../Database/Models/user.model.js";import { Doctor } from "../../Database/Models/doctor.model.js";
import { Patient } from "../../Database/Models/patient.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../../Database/Email/Email.js";
import catchError from "../../Middlewares/catchError.js";
const signup = catchError(async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashedPass = bcrypt.hashSync(password, 8);

  const user = await User.create({
    name,
    email,
    password: hashedPass,
    role,
  });

  if (role === "doctor") {
    await Doctor.create({ user: user._id, specialty: "", bio: "", phone: "" });
  } else if (role === "patient") {
    await Patient.create({ user: user._id, phone: "", age: null, gender: "" });
  }

  sendEmail(email);

  user.password = undefined;
  res.status(201).json({ message: "Account created. Please verify your email.", data: user });
});

const signin = catchError(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(404).json({ message: "User not found. Please sign up!" });

  const match = bcrypt.compareSync(password, user.password);
  if (!match) return res.status(422).json({ message: "Invalid password!" });

  if (!user.isConfirmed) return res.status(401).json({ message: "Please verify your email first!" });

  const token = jwt.sign({ _id: user._id, role: user.role, name: user.name }, "nana", { expiresIn: "1d" });
  user.password = undefined;

  res.status(200).json({ message: "Welcome back!", data: user, token });
});

const verifyAccount = catchError(async (req, res) => {
  const token = req.params.email;
  jwt.verify(token, "myEmail", async (err, decodedEmail) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    await User.findOneAndUpdate({ email: decodedEmail }, { isConfirmed: true });
    res.status(200).json({ message: "Account verified successfully" });
  });
});

const deleteUser = catchError(async (req, res) => {
  const id = req.params.id;
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) return res.status(404).json({ message: "User not found" });

  await deletedUser.deleteOne();
  res.status(200).json({ message: "Deleted user", data: deletedUser });
});

export { signup, signin, verifyAccount, deleteUser };