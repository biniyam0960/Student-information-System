import React, { useEffect, useState } from "react";

interface Admin {
  id: string;
  name: string;
  email: string;
}

const Profile: React.FC = () => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch admin profile
  useEffect(() => {
    fetch("/api/admin/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setAdmin(data);
        setLoading(false);
      });
  }, [token]);

  // Change password
  const changePassword = async () => {
    if (!oldPassword || !newPassword) return;

    setPasswordLoading(true);

    await fetch("/api/users/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    setOldPassword("");
    setNewPassword("");
    setPasswordLoading(false);
  };

  if (loading) return <p>Loading profile...</p>;
  if (!admin) return <p>No profile found.</p>;

  return (
    <div className="profile-page">
      <h2>Admin Profile</h2>

      <div className="profile-details">
        <p><strong>ID:</strong> {admin.id}</p>
        <p><strong>Name:</strong> {admin.name}</p>
        <p><strong>Email:</strong> {admin.email}</p>
        <p><strong>Role:</strong> Administrator</p>
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

export default Profile;
