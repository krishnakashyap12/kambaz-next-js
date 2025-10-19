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

// ✅ Import JSON data
import assignmentsData from "../../../Database/assignments.json";

export default function AssignmentsPage() {
  const { cid } = useParams<{ cid: string }>();
  const base = `/Courses/${cid}/Assignments`;

  // ✅ Filter only assignments belonging to this course
  const assignments = assignmentsData.filter((a) => a.course === cid);

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
          <Button variant="danger" className="text-nowrap" id="wd-add-assignment">
            <FaPlus className="me-2" /> Assignment
          </Button>
        </div>
      </div>

      {/* Section Header */}
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

      {/* Assignment List */}
      <ListGroup className="rounded-0 mt-2">
        {assignments.map((a) => (
          <ListGroupItem key={a._id} className="p-3 ps-1 wd-assignment-row">
            <div className="d-flex align-items-start">
              <BsGripVertical className="me-2 fs-5 text-muted flex-shrink-0" />
              <div className="flex-fill">
                <Link
                  href={`${base}/${a._id}`}
                  className="fw-semibold text-decoration-none"
                >
                  {a.title}
                </Link>
                <div className="small mt-1">
                  <span className="text-success me-3">Multiple Modules</span>
                  <span className="text-muted">
                    Not available until May 6 • 12:00am
                  </span>
                  <span className="mx-2 text-muted">|</span>
                  <span className="text-muted">Due May 13 • 11:59pm</span>
                  <span className="mx-2 text-muted">|</span>
                  <span className="text-muted">100 pts</span>
                </div>
              </div>
              <GreenCheckmark />
              <IoEllipsisVertical className="fs-4 flex-shrink-0" />
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}
