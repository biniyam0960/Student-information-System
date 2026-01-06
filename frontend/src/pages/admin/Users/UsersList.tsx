import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
}

const UsersList = ({ search }: { search: string }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [loadingReset, setLoadingReset] = useState(false);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // Role filtering
  const students = users.filter((u) => u.role === "student");
  const teachers = users.filter((u) => u.role === "teacher");
  const admins = users.filter((u) => u.role === "admin");

  // Search filter
  const filterBySearch = (list: User[]) =>
    list.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
    );

  // Reset password
  const handleResetPassword = async (userId: string) => {
    if (!newPassword) {
      alert("Enter new password");
      return;
    }

    setLoadingReset(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!res.ok) throw new Error("Reset failed");

      alert("Password reset successfully");
      setResetUserId(null);
      setNewPassword("");
    } catch {
      alert("Error resetting password");
    } finally {
      setLoadingReset(false);
    }
  };

  const renderTable = (title: string, list: User[]) => {
    const filtered = filterBySearch(list);

    return (
      <div className="card" style={{ marginBottom: "24px" }}>
        <h3>{title}</h3>

        {filtered.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>******</td>
                  <td>
                    {resetUserId === u.id ? (
                      <>
                        <input
                          type="password"
                          placeholder="New password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          style={{ marginRight: "6px" }}
                        />
                        <button
                          onClick={() => handleResetPassword(u.id)}
                          disabled={loadingReset}
                        >
                          {loadingReset ? "Saving..." : "Save"}
                        </button>
                        <button onClick={() => setResetUserId(null)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setResetUserId(u.id)}>
                        Reset Password
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div>
      {renderTable("Students", students)}
      {renderTable("Teachers", teachers)}
      {renderTable("Admins", admins)}
    </div>
  );
};

export default UsersList;
