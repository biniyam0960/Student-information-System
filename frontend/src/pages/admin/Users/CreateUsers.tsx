import { useState } from "react";

interface NewUser {
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  password: string;
}

interface Props {
  onUserCreated?: () => void;
}

const CreateUser = ({ onUserCreated }: Props) => {
  const [user, setUser] = useState<NewUser>({
    name: "",
    email: "",
    role: "student",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.name || !user.email || !user.password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!res.ok) throw new Error("Failed to create user");

      alert("User created successfully");
      setUser({ name: "", email: "", role: "student", password: "" });

      // Trigger parent refresh
      onUserCreated?.();
    } catch (err) {
      console.error(err);
      alert("Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Create New User</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={user.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} required />
        <select name="role" value={user.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <input type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange} required />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
