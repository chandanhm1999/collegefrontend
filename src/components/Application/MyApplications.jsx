import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);

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

        const res = await axios.get(endpoint, { withCredentials: true });
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

  const startEditing = (app) => {
    setCurrentEdit(app);
    setEditMode(true);
  };

  const handleEditChange = (e) => {
    setCurrentEdit({ ...currentEdit, [e.target.name]: e.target.value });
  };

  const saveEdits = async () => {
    try {
      const res = await axios.put(
        `https://newcollegebackend.vercel.app/api/application/edit/${currentEdit._id}`,
        currentEdit,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setApplications((prev) =>
        prev.map((app) =>
          app._id === currentEdit._id ? res.data.application : app
        )
      );
      setEditMode(false);
      setCurrentEdit(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update application"
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
            <span>Cover Letter:</span> {element.coverLetter}
          </p>
        </div>
        {user.role === "Job Seeker" && (
          <div className="btn_area">
            <button
              className="editoption"
              onClick={() => deleteApplication(element._id)}
            >
              Delete
            </button>
            <button
              className="editoptionupdate"
              onClick={() => startEditing(element)}
            >
              Update
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

        {/* Edit Modal */}
        {editMode && currentEdit && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Application</h2>
              <input
                type="text"
                name="name"
                value={currentEdit.name}
                onChange={handleEditChange}
                placeholder="Name"
              />
              <input
                type="email"
                name="email"
                value={currentEdit.email}
                onChange={handleEditChange}
                placeholder="Email"
              />
              <input
                type="text"
                name="phone"
                value={currentEdit.phone}
                onChange={handleEditChange}
                placeholder="Phone"
              />
              <input
                type="text"
                name="address"
                value={currentEdit.address}
                onChange={handleEditChange}
                placeholder="Address"
              />
              <textarea
                name="coverLetter"
                value={currentEdit.coverLetter}
                onChange={handleEditChange}
                placeholder="Cover Letter"
              ></textarea>

              <div className="btn_area">
                <button onClick={saveEdits}>Save</button>
                <button onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyApplications;
