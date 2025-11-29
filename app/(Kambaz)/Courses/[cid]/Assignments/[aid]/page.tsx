"use client";

import {
  Button,
  Col,
  FormCheck,
  FormControl,
  FormLabel,
  FormSelect,
  InputGroup,
  Row,
} from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { CiCalendar } from "react-icons/ci";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../../../../store";
import { addAssignment, updateAssignment, setAssignments } from "../reducer";
import * as client from "../client";

type Assignment = {
  _id: string;
  title: string;
  course: string;
  description?: string;
  points?: number;
  group?: string;
  gradeAs?: string;
  submissionType?: string;
  dueDate?: string;
  availableFrom?: string;
  availableUntil?: string;
};

type FormData = {
  title: string;
  description: string;
  points: number;
  group: string;
  gradeAs: string;
  submissionType: string;
  dueDate: string;
  availableFrom: string;
  availableUntil: string;
};

export default function AssignmentEditor() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const cid = params.cid as string;
  const aid = params.aid as string;

  const { assignments } = useSelector(
    (state: RootState) => state.assignmentsReducer
  );
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";

  const [formData, setFormData] = useState<FormData>({
    title: "New Assignment",
    description: "The assignment is available online.",
    points: 100,
    group: "ASSIGNMENTS",
    gradeAs: "Percentage",
    submissionType: "Online",
    dueDate: "2025-05-13T23:59",
    availableFrom: "2025-05-06T00:00",
    availableUntil: "2025-05-20T23:59",
  });

  // Fetch assignment from backend if editing existing one
  useEffect(() => {
    const fetchAssignment = async () => {
      if (aid !== "new") {
        try {
          const assignment = await client.findAssignmentById(aid);
          setFormData({
            title: assignment.title,
            description: assignment.description || "The assignment is available online.",
            points: assignment.points ?? 100,
            group: assignment.group || "ASSIGNMENTS",
            gradeAs: assignment.gradeAs || "Percentage",
            submissionType: assignment.submissionType || "Online",
            dueDate: assignment.dueDate || "2025-05-13T23:59",
            availableFrom: assignment.availableFrom || "2025-05-06T00:00",
            availableUntil: assignment.availableUntil || "2025-05-20T23:59",
          });
        } catch (error) {
          console.error("Error fetching assignment:", error);
        }
      }
    };
    fetchAssignment();
  }, [aid]);

  const handleSave = async () => {
    if (!isFaculty) return;

    try {
      if (aid === "new") {
        const newAssignment = await client.createAssignmentForCourse(cid, formData);
        dispatch(addAssignment(newAssignment));
      } else {
        const assignmentToUpdate = { 
          ...formData, 
          _id: aid, 
          course: cid 
        };
        console.log("Updating assignment with data:", assignmentToUpdate);
        const updatedAssignment = await client.updateAssignment(assignmentToUpdate);
        console.log("Received updated assignment:", updatedAssignment);
        // Update the assignment in the store
        dispatch(updateAssignment(updatedAssignment));
        // Also refetch all assignments to ensure we have the latest data
        const allAssignments = await client.findAssignmentsForCourse(cid);
        dispatch(setAssignments(allAssignments));
      }
      router.push(`/Courses/${cid}/Assignments`);
    } catch (error) {
      console.error("Error saving assignment:", error);
      alert("Failed to save assignment");
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Assignments`);
  };

  return (
    <div id="wd-assignments-editor" className="container mt-4">
      <FormLabel>Assignment Name</FormLabel>
      <FormControl
        type="text"
        id="wd-name"
        value={formData.title}
        disabled={!isFaculty}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <br />

      <div
        contentEditable={isFaculty}
        suppressContentEditableWarning={true}
        className="form-control"
        style={{ minHeight: "120px" }}
        onInput={(e) =>
          setFormData({ ...formData, description: e.currentTarget.textContent || "" })
        }
      >
        {formData.description}
      </div>

      <br />

      {/* Points */}
      <Row className="mb-4">
        <Col className="text-end me-1">Points</Col>
        <Col className="text-start col-8">
          <FormControl
            type="number"
            value={formData.points}
            disabled={!isFaculty}
            onChange={(e) =>
              setFormData({ ...formData, points: parseInt(e.target.value) })
            }
          />
        </Col>
      </Row>

      {/* Assignment Group */}
      <Row className="mb-4">
        <Col className="text-end">Assignment Group</Col>
        <Col className="text-start col-8">
          <FormSelect
            value={formData.group}
            disabled={!isFaculty}
            onChange={(e) => setFormData({ ...formData, group: e.target.value })}
          >
            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
            <option value="QUIZZES">QUIZZES</option>
            <option value="EXAMS">EXAMS</option>
            <option value="PROJECTS">PROJECTS</option>
          </FormSelect>
        </Col>
      </Row>

      {/* Display Grade As */}
      <Row className="mb-4">
        <Col className="text-end">Display Grade as</Col>
        <Col className="text-start col-8">
          <FormSelect
            value={formData.gradeAs}
            disabled={!isFaculty}
            onChange={(e) => setFormData({ ...formData, gradeAs: e.target.value })}
          >
            <option value="Percentage">Percentage</option>
            <option value="Points">Points</option>
            <option value="Letter Grade">Letter Grade</option>
          </FormSelect>
        </Col>
      </Row>

      {/* Submission Type */}
      <Row className="mb-4">
        <Col className="text-end">Submission Type</Col>
        <Col className="text-start col-8">
          <div className="border rounded p-2">
            <FormSelect
              value={formData.submissionType}
              disabled={!isFaculty}
              onChange={(e) =>
                setFormData({ ...formData, submissionType: e.target.value })
              }
            >
              <option value="Online">Online</option>
              <option value="On Paper">On paper</option>
              <option value="External Tool">External Tool</option>
            </FormSelect>
            <br />
            <div className="mb-2">
              <strong>Online Entry Options</strong>
            </div>
            <FormCheck type="checkbox" label="Text Entry" disabled={!isFaculty} />
            <FormCheck type="checkbox" label="Website URL" className="mb-2" disabled={!isFaculty} defaultChecked/>
            <FormCheck type="checkbox" label="Media Recordings" disabled={!isFaculty} />
            <FormCheck type="checkbox" label="Student Annotation" disabled={!isFaculty} />
            <FormCheck type="checkbox" label="File Uploads" disabled={!isFaculty} />
          </div>
        </Col>
      </Row>

      {/* Assign Section */}
      <Row className="mb-4">
        <Col className="text-end">Assign</Col>
        <Col className="text-start col-8">
          <div className="border rounded p-2">
            <FormLabel className="fw-bold">Assign to</FormLabel>
            <FormSelect className="mb-2" disabled={!isFaculty}>
              <option value="everyone">Everyone</option>
            </FormSelect>

            <FormLabel className="fw-bold">Due</FormLabel>
            <InputGroup className="mb-2">
              <FormControl
                type="datetime-local"
                value={formData.dueDate}
                disabled={!isFaculty}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
              <InputGroupText>
                <CiCalendar />
              </InputGroupText>
            </InputGroup>

            <Row>
              <Col>
                <FormLabel className="fw-bold">Available from</FormLabel>
                <InputGroup className="mb-2">
                  <FormControl
                    type="datetime-local"
                    value={formData.availableFrom}
                    disabled={!isFaculty}
                    onChange={(e) =>
                      setFormData({ ...formData, availableFrom: e.target.value })
                    }
                  />
                  <InputGroupText>
                    <CiCalendar />
                  </InputGroupText>
                </InputGroup>
              </Col>

              <Col>
                <FormLabel className="fw-bold">Until</FormLabel>
                <InputGroup className="mb-2">
                  <FormControl
                    type="datetime-local"
                    value={formData.availableUntil}
                    disabled={!isFaculty}
                    onChange={(e) =>
                      setFormData({ ...formData, availableUntil: e.target.value })
                    }
                  />
                  <InputGroupText>
                    <CiCalendar />
                  </InputGroupText>
                </InputGroup>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <hr />

      {/* Action Buttons */}
      {isFaculty && (
        <div className="d-flex justify-content-end mb-4">
          <Button
            variant="secondary"
            className="rounded-sm me-2"
            onClick={handleCancel}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            className="rounded-sm"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
}