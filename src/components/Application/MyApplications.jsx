import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
      return;
    }

    const fetchApplications = async () => {
      try {
        const isEmployerOrRecruiter =
          user && (user.role === "Employer" || user.role === "Recruiter");

        const endpoint = isEmployerOrRecruiter
          ? "https://newcollegebackend.vercel.app/api/application/employer/getall"
          : "https://newcollegebackend.vercel.app/api/application/jobseeker/getall";

        console.log("Calling endpoint:", endpoint);

        const res = await axios.get(endpoint, { withCredentials: true });
        console.log("Fetched Applications:", res.data.applications);
        setApplications(res.data.applications);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch applications"
        );
      }
    };

    fetchApplications();
  }, [isAuthorized, user, navigateTo]);

  const deleteApplication = async (id) => {
    try {
      const res = await axios.delete(
        `https://newcollegebackend.vercel.app/api/application/delete/${id}`,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete application"
      );
    }
  };

  const renderCard = (element) => {
    return (
      <div className="job_seeker_card" key={element._id}>
        <div className="detail">
          <p>
            <span>Name:</span> {element.name}
          </p>
          <p>
            <span>Email:</span> {element.email}
          </p>
          <p>
            <span>Phone:</span> {element.phone}
          </p>
          <p>
            <span>Address:</span> {element.address}
          </p>
          <p>
            <span>CoverLetter:</span> {element.coverLetter}
          </p>
        </div>
        {/* Only Job Seekers can delete their own applications */}
        {user.role === "Job Seeker" && (
          <div className="btn_area">
            <button onClick={() => deleteApplication(element._id)}>
              Delete Application
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="my_applications page">
      <div className="container">
        <h1>
          {user?.role === "Job Seeker"
            ? "My Applications"
            : "Applications From Job Seekers"}
        </h1>
        {applications.length === 0 ? (
          <h4>No Applications Found</h4>
        ) : (
          applications.map(renderCard)
        )}
      </div>
    </section>
  );
};

export default MyApplications;
