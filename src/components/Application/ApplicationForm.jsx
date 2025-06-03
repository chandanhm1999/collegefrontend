import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";
import "./ApplicationForm.css";

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(Context);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    coverLetter: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://newcollegebackend.vercel.app/api/application/submit",
        {
          jobId: id,
          ...formData,
        },
        {
          withCredentials: true,
        }
      );
      alert(res.data.message);
      navigate("/applications");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="applicationForm page">
      <div className="form-container">
        <h3>Application Form</h3>
        <form onSubmit={handleSubmit} className="form">
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
          <button type="submit">Send Application</button>
        </form>
      </div>
    </section>
  );
};

export default ApplicationForm;
