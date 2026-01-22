import React, { useEffect, useState } from "react";

interface Teacher {
  id: string;
  name: string;
  email: string;
  major: string;
}

const TeacherProfile: React.FC = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch teacher profile
  useEffect(() => {
    fetch("http://localhost:8080/api/teacher/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setTeacher(data);
        setLoading(false);
      });
  }, [token]);

  // Change password handler
  const changePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert("Please fill both fields");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      alert(data.message || "Password updated successfully");
      setOldPassword("");
      setNewPassword("");
    } catch {
      alert("Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!teacher) return <p>No profile found.</p>;

  return (
    <div className="profile-page">
      <h2>Teacher Profile</h2>
      <div className="profile-details">
        <p><strong>ID:</strong> {teacher.id}</p>
        <p><strong>Name:</strong> {teacher.name}</p>
        <p><strong>Email:</strong> {teacher.email}</p>
        <p><strong>Major:</strong> {teacher.major}</p>
      </div>

      <div className="change-password">
        <h3>Change Password</h3>
        <input
          type="password"
          placeholder="Old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={changePassword} disabled={passwordLoading}>
          {passwordLoading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
};

export default TeacherProfile;
