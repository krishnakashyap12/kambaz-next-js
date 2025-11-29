"use client";
import { useState, useEffect, useCallback } from "react";
import { Table, FormControl, Button } from "react-bootstrap";
import { FaUserCircle, FaPencilAlt, FaCheck, FaPlus } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import * as client from "../client";
import { User } from "../../types";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [editingName, setEditingName] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState<Partial<User>>({
    firstName: "",
    lastName: "",
    username: "",
    password: "password",
    email: "",
    role: "STUDENT",
    loginId: "",
    section: "",
    totalActivity: "0",
  });

  const fetchUsers = async () => {
    const users = await client.findAllUsers();
    // Filter out any null or undefined values
    setUsers(users.filter((user): user is User => user != null && user._id != null));
  };

  const filterUsersByRole = async (role: string) => {
    setRole(role);
    if (role) {
      const users = await client.findUsersByRole(role);
      // Filter out any null or undefined values
      setUsers(users.filter((user): user is User => user != null && user._id != null));
    } else {
      fetchUsers();
    }
  };

  const filterUsersByName = async (name: string) => {
    setName(name);
    if (name) {
      const users = await client.findUsersByPartialName(name);
      // Filter out any null or undefined values
      setUsers(users.filter((user): user is User => user != null && user._id != null));
    } else {
      fetchUsers();
    }
  };

  const handleUserClick = async (userId: string) => {
    const user = await client.findUserById(userId);
    if (user && user._id) {
      setSelectedUser(user);
      setEditingName(`${user.firstName} ${user.lastName}`);
      setEditing(false);
    }
  };

  const closeSidebar = () => {
    setSelectedUser(null);
    setEditing(false);
    setIsNewUser(false);
    // Reset form
    setNewUserForm({
      firstName: "",
      lastName: "",
      username: "",
      password: "password",
      email: "",
      role: "STUDENT",
      loginId: "",
      section: "",
      totalActivity: "0",
    });
  };

  const handleAddNewUser = () => {
    // Open sidebar with empty form, don't create user yet
    setSelectedUser(null);
    setIsNewUser(true);
    setEditing(true);
    setEditingName("");
  };

  const saveUser = async () => {
    if (isNewUser) {
      // Create new user
      if (!newUserForm.firstName || !newUserForm.lastName || !newUserForm.username) {
        alert("Please fill in at least First Name, Last Name, and Username");
        return;
      }
      try {
        const createdUser = await client.createUser(newUserForm);
        // Refresh the users list
        await fetchUsers();
        // Switch to view mode with the created user
        setSelectedUser(createdUser);
        setIsNewUser(false);
        setEditing(false);
        setEditingName(`${createdUser.firstName} ${createdUser.lastName}`);
      } catch (error) {
        console.error("Error creating user:", error);
        alert("Failed to create user. Username may already exist.");
      }
    } else if (selectedUser) {
      // Update existing user
      const nameParts = editingName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      const updatedUser = { ...selectedUser, firstName, lastName };
      try {
        const savedUser = await client.updateUser(updatedUser);
        setSelectedUser(savedUser);
        setUsers(users.filter(u => u != null).map(u => u._id === savedUser._id ? savedUser : u));
        setEditing(false);
        await fetchUsers();
      } catch (error) {
        console.error("Error updating user:", error);
        alert("Failed to update user");
      }
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await client.deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
      closeSidebar();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ marginRight: (selectedUser || isNewUser) ? "25%" : "0", transition: "margin-right 0.3s" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Users</h3>
          <Button
            variant="primary"
            onClick={handleAddNewUser}
            id="wd-add-people-btn"
            className="d-flex align-items-center"
          >
            <FaPlus className="me-2" />
            People
          </Button>
        </div>
        <FormControl
          onChange={(e) => filterUsersByName(e.target.value)}
          placeholder="Search people"
          className="float-start w-25 me-2 mb-2 wd-filter-by-name"
          value={name}
        />
        <select
          value={role}
          onChange={(e) => filterUsersByRole(e.target.value)}
          className="form-select float-start w-25 mb-2 wd-select-role"
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="TA">Assistants</option>
          <option value="FACULTY">Faculty</option>
          <option value="ADMIN">Administrators</option>
        </select>
        <div className="clearfix"></div>
        <div id="wd-people-table">
          <Table striped>
            <thead>
              <tr>
                <th>Name</th>
                <th>Login ID</th>
                <th>Section</th>
                <th>Role</th>
                <th>Last Activity</th>
                <th>Total Activity</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(user => user != null && user._id != null).map((user) => (
                <tr key={user._id}>
                  <td className="wd-full-name text-nowrap">
                    <button
                      onClick={() => handleUserClick(user._id)}
                      className="btn btn-link text-decoration-none p-0 text-start"
                      style={{ border: "none", background: "none" }}
                    >
                      <FaUserCircle className="me-2 fs-1 text-secondary" />
                      <span className="wd-first-name">{user.firstName}</span>{" "}
                      <span className="wd-last-name">{user.lastName}</span>
                    </button>
                  </td>
                  <td className="wd-login-id">{user.loginId}</td>
                  <td className="wd-section">{user.section}</td>
                  <td className="wd-role">{user.role}</td>
                  <td className="wd-last-activity">{user.lastActivity}</td>
                  <td className="wd-total-activity">{user.totalActivity}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {(selectedUser || isNewUser) && (
        <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow" style={{ width: "25%", zIndex: 1000, overflowY: "auto" }}>
          <button
            onClick={closeSidebar}
            className="btn position-absolute end-0 top-0 wd-close-details"
            style={{ zIndex: 1001 }}
          >
            <IoCloseSharp className="fs-1" />
          </button>
          <div className="text-center mt-2">
            <FaUserCircle className="text-secondary me-2 fs-1" />
          </div>
          <hr />
          
          {isNewUser ? (
            // New User Form
            <div>
              <h5 className="mb-3">New User</h5>
              <div className="mb-3">
                <label className="form-label"><b>First Name</b></label>
                <FormControl
                  value={newUserForm.firstName || ""}
                  onChange={(e) => setNewUserForm({ ...newUserForm, firstName: e.target.value })}
                  placeholder="First Name"
                  className="wd-edit-first-name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label"><b>Last Name</b></label>
                <FormControl
                  value={newUserForm.lastName || ""}
                  onChange={(e) => setNewUserForm({ ...newUserForm, lastName: e.target.value })}
                  placeholder="Last Name"
                  className="wd-edit-last-name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label"><b>Username</b></label>
                <FormControl
                  value={newUserForm.username || ""}
                  onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                  placeholder="Username"
                  className="wd-edit-username"
                />
              </div>
              <div className="mb-3">
                <label className="form-label"><b>Password</b></label>
                <FormControl
                  type="password"
                  value={newUserForm.password || "password"}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  placeholder="Password"
                  className="wd-edit-password"
                />
              </div>
              <div className="mb-3">
                <label className="form-label"><b>Login ID</b></label>
                <FormControl
                  value={newUserForm.loginId || ""}
                  onChange={(e) => setNewUserForm({ ...newUserForm, loginId: e.target.value })}
                  placeholder="Login ID"
                  className="wd-edit-login-id"
                />
              </div>
              <div className="mb-3">
                <label className="form-label"><b>Role</b></label>
                <FormControl
                  as="select"
                  value={newUserForm.role || "STUDENT"}
                  onChange={(e) => {
                    const roleValue = e.target.value as "STUDENT" | "FACULTY" | "ADMIN" | "TA";
                    setNewUserForm({ ...newUserForm, role: roleValue });
                  }}
                  className="wd-edit-role"
                >
                  <option value="STUDENT">Student</option>
                  <option value="TA">TA</option>
                  <option value="FACULTY">Faculty</option>
                  <option value="ADMIN">Admin</option>
                </FormControl>
              </div>
              <div className="mb-3">
                <label className="form-label"><b>Section</b></label>
                <FormControl
                  value={newUserForm.section || ""}
                  onChange={(e) => setNewUserForm({ ...newUserForm, section: e.target.value })}
                  placeholder="Section"
                  className="wd-edit-section"
                />
              </div>
              <div className="mb-3">
                <label className="form-label"><b>Email</b></label>
                <FormControl
                  type="email"
                  value={newUserForm.email || ""}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  placeholder="Email"
                  className="wd-edit-email"
                />
              </div>
              <hr />
              <Button
                onClick={saveUser}
                variant="primary"
                className="float-end wd-save-new-user"
              >
                <FaCheck className="me-2" />
                Create User
              </Button>
              <Button
                onClick={closeSidebar}
                variant="secondary"
                className="float-end me-2 wd-cancel-new-user"
              >
                Cancel
              </Button>
            </div>
          ) : selectedUser ? (
            // Existing User View/Edit
            <>
              <div className="text-danger fs-4">
                {!editing && (
                  <FaPencilAlt
                    onClick={() => setEditing(true)}
                    className="float-end fs-5 mt-2 wd-edit"
                    style={{ cursor: "pointer" }}
                  />
                )}
                {editing && (
                  <FaCheck
                    onClick={saveUser}
                    className="float-end fs-5 mt-2 me-2 wd-save"
                    style={{ cursor: "pointer" }}
                  />
                )}
                {!editing && (
                  <div className="wd-name" onClick={() => setEditing(true)} style={{ cursor: "pointer" }}>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </div>
                )}
                {editing && (
                  <FormControl
                    className="w-50 wd-edit-name"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveUser();
                      }
                      if (e.key === "Escape") {
                        setEditing(false);
                        setEditingName(`${selectedUser.firstName} ${selectedUser.lastName}`);
                      }
                    }}
                    autoFocus
                  />
                )}
              </div>
              <b>Roles:</b> <span className="wd-roles">{selectedUser.role}</span>
              <br />
              <b>Login ID:</b> <span className="wd-login-id">{selectedUser.loginId}</span>
              <br />
              <b>Section:</b> <span className="wd-section">{selectedUser.section}</span>
              <br />
              <b>Total Activity:</b>{" "}
              <span className="wd-total-activity">{selectedUser.totalActivity}</span>
              <hr />
              <button
                onClick={() => deleteUser(selectedUser._id)}
                className="btn btn-danger float-end wd-delete"
              >
                Delete
              </button>
              <button
                onClick={closeSidebar}
                className="btn btn-secondary float-start float-end me-2 wd-cancel"
              >
                Cancel
              </button>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

