"use client";

import { Table, Form, Row, Col, InputGroup } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import * as coursesClient from "../../../client";
import { User } from "../../../../types";

export default function PeopleTable() {
  const { cid } = useParams();
  // enrollmentsDao may return null for deleted users; allow null in the array
  const [users, setUsers] = useState<(User | null)[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    const fetchUsers = async () => {
      if (cid) {
        const courseUsers = await coursesClient.findUsersForCourse(cid as string);
        setUsers(courseUsers);
      }
    };
    fetchUsers();
  }, [cid]);

  const validUsers = useMemo(() => users.filter((u): u is User => !!u), [users]);

  const roles = useMemo(() => {
    const setRoles = new Set<string>();
    validUsers.forEach((u) => { if (u.role) setRoles.add(u.role); });
    return ["All", ...Array.from(setRoles)];
  }, [validUsers]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return validUsers.filter((u) => {
      if (roleFilter !== "All" && u.role !== roleFilter) return false;
      if (!q) return true;
      const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
      return (
        fullName.includes(q) ||
        (u.loginId || "").toLowerCase().includes(q)
      );
    });
  }, [validUsers, search, roleFilter]);

  return (
    <div id="wd-people-table">
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Search by name or login id"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>
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
          {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td className="wd-full-name text-nowrap">
                  <FaUserCircle className="me-2 fs-1 text-secondary" />
                  <span className="wd-first-name">{user.firstName}</span>{" "}
                  <span className="wd-last-name">{user.lastName}</span>
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
  );
}
