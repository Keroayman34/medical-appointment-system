import React, { useState } from "react";
import { asts } from "../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import { addDoctor } from "../redux/slices/adminSlice";
import { toast } from "react-toastify";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1");
  const [fees, setFees] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address, setAddress] = useState("");
  const [about, setAbout] = useState("");

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.admin);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!docImg) {
      toast.warning("Please select doctor image");
      return;
    }

    const formData = new FormData();
    formData.append("image", docImg);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("experience", experience);
    formData.append("fees", Number(fees));
    formData.append("speciality", speciality);
    formData.append("degree", degree);
    formData.append("address", address);
    formData.append("about", about);

    const result = await dispatch(addDoctor(formData));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Doctor added successfully");
      setDocImg(false);
      setName("");
      setEmail("");
      setPassword("");
      setExperience("1");
      setFees("");
      setSpeciality("General physician");
      setDegree("");
      setAddress("");
      setAbout("");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-4 text-3xl font-bold text-[#355872]">Add Doctor</p>

      <div className="w-full max-w-5xl border border-[#7AAACE]/45 bg-[#F7F8F0]/92 rounded-3xl px-6 md:px-8 py-8 shadow-[0_12px_32px_rgba(53,88,114,0.14)]">
        <div className="flex items-center gap-4 mb-8">
          <label htmlFor="doc-img" className="cursor-pointer">
            <img
              className="w-20 h-20 rounded-2xl object-cover border border-[#7AAACE]/45 bg-[#9CD5FF]/25"
              src={docImg ? URL.createObjectURL(docImg) : asts.prof}
              alt="Doctor"
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            accept="image/*"
            hidden
          />
          <div>
            <p className="text-[#355872] font-semibold">Upload doctor picture</p>
            <p className="text-[#355872]/70 text-sm">JPG, PNG or WEBP</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#355872]">
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Doctor Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="border border-[#9CD5FF]/75 rounded-xl px-3 py-2 bg-white/90 outline-main"
              type="text"
              placeholder="Name"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-semibold">Doctor Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border border-[#9CD5FF]/75 rounded-xl px-3 py-2 bg-white/90 outline-main"
              type="email"
              placeholder="Email"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-semibold">Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border border-[#9CD5FF]/75 rounded-xl px-3 py-2 bg-white/90 outline-main"
              type="password"
              placeholder="Password"
              minLength={6}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-semibold">Speciality</p>
            <select
              onChange={(e) => setSpeciality(e.target.value)}
              value={speciality}
              className="border border-[#9CD5FF]/75 rounded-xl px-3 py-2 bg-white/90 outline-main"
            >
              <option value="General physician">General physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Neurologist">Neurologist</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-semibold">Degree</p>
            <input
              onChange={(e) => setDegree(e.target.value)}
              value={degree}
              className="border border-[#9CD5FF]/75 rounded-xl px-3 py-2 bg-white/90 outline-main"
              type="text"
              placeholder="MBBS"
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-semibold">Experience (Years)</p>
            <input
              onChange={(e) => setExperience(e.target.value)}
              value={experience}
              className="border border-[#9CD5FF]/75 rounded-xl px-3 py-2 bg-white/90 outline-main"
              type="number"
              min="0"
              placeholder="1"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-semibold">Fees</p>
            <input
              onChange={(e) => setFees(e.target.value)}
              value={fees}
              className="border border-[#9CD5FF]/75 rounded-xl px-3 py-2 bg-white/90 outline-main"
              type="number"
              min="0"
              placeholder="Fees"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-semibold">Address</p>
            <input
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              className="border border-[#9CD5FF]/75 rounded-xl px-3 py-2 bg-white/90 outline-main"
              type="text"
              placeholder="Clinic or city"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-1 text-[#355872]">
          <p className="font-semibold">About Doctor</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="border border-[#9CD5FF]/75 rounded-2xl px-3 py-3 bg-white/90 outline-main"
            placeholder="Write about doctor"
            rows={5}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-main px-10 py-3 mt-6 text-white rounded-full hover:shadow-lg hover:bg-[#2e4d66] transition-all"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Doctor"}
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
