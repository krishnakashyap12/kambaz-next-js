"use client";

import { useParams } from "next/navigation";
import {
  Button,
  Col,
  Row,
  Card,
  FormControl,
  FormLabel,
  FormSelect,
} from "react-bootstrap";

export default function EditAssignmentPage() {
  const { aid, cid } = useParams<{ aid: string; cid: string }>();

  return (
    <div id="wd-edit-assignment" className="mt-2">
      <h2 className="mb-3">
        Assignments &nbsp;›&nbsp; <span className="text-primary">{aid}</span>
      </h2>

      <Card className="p-4 shadow-sm border-0">
        {/* Assignment Name */}
        <div className="mb-4">
          <FormLabel>Assignment Name</FormLabel>
          <FormControl size="lg" defaultValue={aid} />
        </div>

        {/* Description */}
        <div className="mb-4">
          <FormLabel>Description</FormLabel>
          <FormControl
            as="textarea"
            rows={6}
            defaultValue={`The assignment is available online\n\nSubmit your link here...`}
          />
        </div>

        {/* Points, Group, Display As */}
        <Row className="mb-4">
          <Col md={4}>
            <FormLabel>Points</FormLabel>
            <FormControl type="number" defaultValue={100} />
          </Col>

          <Col md={4}>
            <FormLabel>Assignment Group</FormLabel>
            <FormSelect defaultValue="ASSIGNMENTS">
              <option>ASSIGNMENTS</option>
              <option>QUIZZES</option>
              <option>EXAMS</option>
              <option>PROJECT</option>
            </FormSelect>
          </Col>

          <Col md={4}>
            <FormLabel>Display Grade as</FormLabel>
            <FormSelect defaultValue="Percentage">
              <option>Percentage</option>
              <option>Points</option>
            </FormSelect>
          </Col>
        </Row>

        {/* Dates */}
        <Row className="mb-4">
          <Col md={4}>
            <FormLabel>Due</FormLabel>
            <FormControl type="datetime-local" />
          </Col>
          <Col md={4}>
            <FormLabel>Available from</FormLabel>
            <FormControl type="datetime-local" />
          </Col>
          <Col md={4}>
            <FormLabel>Until</FormLabel>
            <FormControl type="datetime-local" />
          </Col>
        </Row>

        <div className="d-flex gap-2">
          <Button variant="primary">Save</Button>
          <Button variant="secondary" href={`/Courses/${cid}/Assignments`} as="a">
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
