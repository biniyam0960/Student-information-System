import { useState } from "react";
import UsersList from "./UsersList";
import CreateUser from "./CreateUsers";

const Users = () => {
  const [search, setSearch] = useState("");

  return (
    <div>
      <h2>User Management</h2>

      {/* SEARCH BAR */}
      <input
        type="text"
        className="search-input"
        placeholder="Search users by name, email, role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CREATE USER */}
      <CreateUser />

      {/* USERS LIST */}
      <UsersList search={search} />
    </div>
  );
};

export default Users;
