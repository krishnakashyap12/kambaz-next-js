"use client";
import Link from "next/link";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../store";
import { addNewCourse, updateCourse, deleteCourse } from "../Courses/reducer";
import { enrollUser, unenrollUser } from "../Enrollments/reducer";
import { Card, Row, Col, Button, FormControl } from "react-bootstrap";

// Define Course type
interface Course {
  _id: string;
  name: string;
  number: string;
  startDate: string;
  endDate: string;
  image: string;
  description: string;
  instructor?: string;
}

export default function Dashboard() {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const dispatch = useDispatch();

  const [course, setCourse] = useState<Course>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  const [showAllCourses, setShowAllCourses] = useState(false);

  const isFaculty = currentUser?.role === "FACULTY";

  const isEnrolled = (courseId: string) => {
    if (!currentUser) return false;
    return enrollments.some(
      (enrollment) =>
        enrollment.user === currentUser._id &&
        enrollment.course === courseId
    );
  };

  const enrolledCourses = currentUser
    ? courses.filter((c) => isEnrolled(c._id))
    : [];

  const displayedCourses = showAllCourses ? courses : enrolledCourses;

  const handleEnrollment = (courseId: string) => {
    if (!currentUser) return;
    if (isEnrolled(courseId)) {
      dispatch(unenrollUser({ userId: currentUser._id, courseId }));
    } else {
      dispatch(enrollUser({ userId: currentUser._id, courseId }));
    }
  };

  const handleAddNewCourse = () => {
    const newCourse = {
      ...course,
      _id: uuidv4(),
    };
    dispatch(addNewCourse(newCourse));
    
    setCourse({
      _id: "0",
      name: "New Course",
      number: "New Number",
      startDate: "2023-09-10",
      endDate: "2023-12-15",
      image: "/images/reactjs.jpg",
      description: "New Description",
    });
  };

  const handleUpdateCourse = () => {
    dispatch(updateCourse(course));
  };

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />

      {isFaculty && (
        <>
          <h5>
            New Course
            <Button
              className="float-end ms-2"
              variant="primary"
              id="wd-add-new-course-click"
              onClick={handleAddNewCourse}
            >
              Add
            </Button>
            <Button
              className="float-end"
              variant="warning"
              id="wd-update-course-click"
              onClick={handleUpdateCourse}
            >
              Update
            </Button>
          </h5>
          <FormControl
            className="mb-2"
            value={course.name}
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            className="mb-2"
            value={course.description}
            as="textarea"
            rows={3}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
          <hr />
        </>
      )}

      <h2 id="wd-dashboard-published">
        Published Courses ({displayedCourses.length})
        <Button
          variant="primary"
          className="float-end"
          onClick={() => setShowAllCourses(!showAllCourses)}
        >
          {showAllCourses ? "My Courses" : "Enrollments"}
        </Button>
      </h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {displayedCourses.map((c) => (
            <Col key={c._id} style={{ width: "300px" }}>
              <Card>
                <Link
                  href={`/Courses/${c._id}/Home`}
                  className="text-decoration-none text-dark"
                >
                  <Card.Img src={c.image} variant="top" height={160} />
                  <Card.Body>
                    <Card.Title className="text-nowrap overflow-hidden">
                      {c.name}
                    </Card.Title>
                    <Card.Text
                      style={{ height: "100px" }}
                      className="overflow-hidden"
                    >
                      {c.description}
                    </Card.Text>
                    <Button variant="primary">Go</Button>

                    {showAllCourses && (
                      <Button
                        variant={isEnrolled(c._id) ? "danger" : "success"}
                        className="float-end ms-2"
                        onClick={(e) => {
                          e.preventDefault();
                          handleEnrollment(c._id);
                        }}
                      >
                        {isEnrolled(c._id) ? "Unenroll" : "Enroll"}
                      </Button>
                    )}

                    {isFaculty && !showAllCourses && (
                      <>
                        <Button
                          variant="danger"
                          className="float-end ms-2"
                          id="wd-delete-course-click"
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(deleteCourse(c._id));
                          }}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="warning"
                          className="float-end"
                          id="wd-edit-course-click"
                          onClick={(e) => {
                            e.preventDefault();
                            setCourse(c);
                          }}
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}