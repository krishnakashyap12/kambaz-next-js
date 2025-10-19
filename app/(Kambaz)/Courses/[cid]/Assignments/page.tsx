"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Button,
  FormControl,
  ListGroup,
  ListGroupItem,
  Badge,
} from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../Modules/GreenCheckMark";

import assignmentsData from "../../../Database/assignments.json";

export default function AssignmentsPage() {
  const { cid } = useParams<{ cid: string }>();
  const base = `/Courses/${cid}/Assignments`;

  const assignments = assignmentsData.filter((a) => a.course === cid);

  const displayedAssignments =
    assignments.length > 0
      ? assignments.map((a, i) => ({
          id: a._id,
          title: a.title,
          due:
            i === 0
              ? "May 13 • 11:59pm"
              : i === 1
              ? "May 20 • 11:59pm"
              : "May 27 • 11:59pm",
          pts: 100,
          avail:
            i === 0
              ? "Not available until May 6 • 12:00am"
              : i === 1
              ? "Not available until May 13 • 12:00am"
              : "Not available until May 20 • 12:00am",
        }))
      : [];

  return (
    <div id="wd-assignments" className="mt-2">
      <div className="clearfix mb-3">
        <div className="float-start position-relative" style={{ maxWidth: 420 }}>
          <BiSearch
            className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
            style={{ pointerEvents: "none" }}
          />
          <FormControl
            size="lg"
            type="text"
            placeholder="Search..."
            id="wd-search-assignment"
            className="ps-5 rounded-1"
            style={{
              borderColor: "#ccc",
              boxShadow: "none",
            }}
          />
        </div>

        <div className="float-end">
          <Button variant="secondary" className="me-2 text-nowrap">
            <FaPlus className="me-2" /> Group
          </Button>
          <Button
            variant="danger"
            className="text-nowrap"
            id="wd-add-assignment"
          >
            <FaPlus className="me-2" /> Assignment
          </Button>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between border rounded px-3 py-2 bg-white">
        <div className="d-flex align-items-center">
          <BsGripVertical className="me-2 text-muted" />
          <h5 className="m-0">ASSIGNMENTS</h5>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Badge bg="light" text="dark" pill className="wd-badge-pill">
            40% of Total
          </Badge>
          <Button size="sm" variant="light" className="px-2">
            +
          </Button>
          <Button size="sm" variant="light" className="px-2">
            <IoEllipsisVertical />
          </Button>
        </div>
      </div>

      <ListGroup className="rounded-0 mt-2">
        {displayedAssignments.length === 0 ? (
          <ListGroupItem className="text-muted text-center">
            No assignments found for this course.
          </ListGroupItem>
        ) : (
          displayedAssignments.map((a) => (
            <ListGroupItem key={a.id} className="p-3 ps-1 wd-assignment-row">
              <div className="d-flex align-items-start">
                <BsGripVertical className="me-2 fs-5 text-muted flex-shrink-0" />
                <div className="flex-fill">
                  <Link
                    href={`${base}/${a.id}`}
                    className="fw-semibold text-decoration-none"
                  >
                    {a.title}
                  </Link>
                  <div className="small mt-1">
                    <span className="text-success me-3">Multiple Modules</span>
                    <span className="text-muted">{a.avail}</span>
                    <span className="mx-2 text-muted">|</span>
                    <span className="text-muted">Due {a.due}</span>
                    <span className="mx-2 text-muted">|</span>
                    <span className="text-muted">{a.pts} pts</span>
                  </div>
                </div>
                <GreenCheckmark />
                <IoEllipsisVertical className="fs-4 flex-shrink-0" />
              </div>
            </ListGroupItem>
          ))
        )}
      </ListGroup>
    </div>
  );
}
