"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { deleteAssignment } from "./reducer";
import {
  Button,
  FormControl,
  ListGroup,
  ListGroupItem,
  Badge,
} from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../Modules/GreenCheckMark";
import { FaSearch } from "react-icons/fa";

export default function Assignments() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer
  );
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const filteredAssignments = assignments.filter(
    (assignment) => assignment.course === cid
  );

  const isFaculty = currentUser?.role === "FACULTY";

  const handleDelete = (assignmentId: string) => {
    if (window.confirm("Are you sure you want to remove this assignment?")) {
      dispatch(deleteAssignment(assignmentId));
    }
  };

  return (
    <div id="wd-assignments" className="mt-2">
      <div className="clearfix mb-3">
        <div className="float-start position-relative" style={{ maxWidth: 420 }}>
          <FaSearch
            className="position-absolute text-muted"
            style={{
              top: "50%",
              left: "14px",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          />
          <FormControl
            size="lg"
            type="text"
            placeholder="Search..."
            id="wd-search-assignment"
            className="ps-5 rounded-1"
            style={{ borderColor: "#ccc", boxShadow: "none" }}
          />
        </div>

        {isFaculty && (
          <div className="float-end">
            <Button variant="secondary" className="me-2 text-nowrap">
              <FaPlus className="me-2" /> Group
            </Button>
            <Button
              variant="danger"
              className="text-nowrap"
              id="wd-add-assignment"
              onClick={() => router.push(`/Courses/${cid}/Assignments/new`)}
            >
              <FaPlus className="me-2" /> Assignment
            </Button>
          </div>
        )}
      </div>

      <div className="d-flex align-items-center justify-content-between border rounded px-3 py-2 bg-white">
        <div className="d-flex align-items-center">
          <BsGripVertical className="me-2 text-muted" />
          <h5 className="m-0">ASSIGNMENTS</h5>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Badge bg="light" text="dark" pill>
            40% of Total
          </Badge>
          {isFaculty && (
            <>
              <Button size="sm" variant="light" className="px-2">
                +
              </Button>
              <Button size="sm" variant="light" className="px-2">
                <IoEllipsisVertical />
              </Button>
            </>
          )}
        </div>
      </div>

      <ListGroup className="rounded-0 mt-2">
        {filteredAssignments.length === 0 ? (
          <ListGroupItem className="text-muted text-center">
            No assignments found for this course.
          </ListGroupItem>
        ) : (
          filteredAssignments.map((assignment) => (
            <ListGroupItem
              key={assignment._id}
              className="p-3 ps-1 wd-assignment-row d-flex align-items-start"
            >
              <BsGripVertical className="me-2 fs-5 text-muted flex-shrink-0" />
              <div className="flex-fill">
                <Link
                  href={`/Courses/${cid}/Assignments/${assignment._id}`}
                  className="fw-semibold text-decoration-none"
                >
                  {assignment.title}
                </Link>
                <div className="small mt-1 text-muted">
                  <span className="text-success me-3">Multiple Modules</span>
                  <span>Not available until May 6 • 12:00am</span>
                  <span className="mx-2">|</span>
                  <span>Due May 13 • 11:59pm</span>
                  <span className="mx-2">|</span>
                  <span>100 pts</span>
                </div>
              </div>
              <GreenCheckmark />
              {isFaculty && (
                <FaTrash
                  className="text-danger ms-2 fs-5"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleDelete(assignment._id)}
                />
              )}
              <IoEllipsisVertical className="fs-4 flex-shrink-0 ms-2" />
            </ListGroupItem>
          ))
        )}
      </ListGroup>
    </div>
  );
}