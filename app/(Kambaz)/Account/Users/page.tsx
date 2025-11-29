"use client";
import { useState, useEffect } from "react";
import { Table, FormControl } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import * as client from "../client";
import { User } from "../../types";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");

  const fetchUsers = async () => {
    const users = await client.findAllUsers();
    setUsers(users);
  };

  const filterUsersByRole = async (role: string) => {
    setRole(role);
    if (role) {
      const users = await client.findUsersByRole(role);
      setUsers(users);
    } else {
      fetchUsers();
    }
  };

  const filterUsersByName = async (name: string) => {
    setName(name);
    if (name) {
      const users = await client.findUsersByPartialName(name);
      setUsers(users);
    } else {
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h3>Users</h3>
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
            {users.map((user) => (
              <tr key={user._id}>
                <td className="wd-full-name text-nowrap">
                  <Link
                    href={`/Account/Users/${user._id}`}
                    className="text-decoration-none"
                  >
                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                    <span className="wd-first-name">{user.firstName}</span>{" "}
                    <span className="wd-last-name">{user.lastName}</span>
                  </Link>
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
  );
}

