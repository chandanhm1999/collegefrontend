import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";

const ApplicationForm = () => {
  const { id } = useParams(); // jobId from URL
  const navigate = useNavigate();
  const { user } = useContext(Context);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    coverLetter: "",
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resume) return alert("Please attach a resume!");

    const data = new FormData();
    data.append("jobId", id);
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("coverLetter", formData.coverLetter);
    data.append("resume", formData.resume);

    try {
      const res = await axios.post(
        "https://newcollegebackend.vercel.app/api/application/submit",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert(res.data.message);
      navigate("/applications"); // redirect after success
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="applicationForm page">
      <div className="container">
        <h3>Application Form</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            required
            onChange={handleChange}
            placeholder="Your Name"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            required
            onChange={handleChange}
            placeholder="Your Email"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            required
            onChange={handleChange}
            placeholder="Your Phone Number"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            required
            onChange={handleChange}
            placeholder="Your Address"
          />
          <textarea
            name="coverLetter"
            rows="5"
            value={formData.coverLetter}
            required
            onChange={handleChange}
            placeholder="Cover Letter..."
          ></textarea>
          <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            required
          />
          <button type="submit">Send Application</button>
        </form>
      </div>
    </section>
  );
};

export default ApplicationForm;
