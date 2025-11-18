"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setCourses } from "../Courses/reducer";
import * as coursesClient from "../Courses/client";
import * as enrollmentsClient from "../Courses/[cid]/Enrollments/client";
import { Course, Enrollment } from "./../types";
import { Card, Row, Col, Button, FormControl } from "react-bootstrap";

export default function Dashboard() {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const dispatch = useDispatch();

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [course, setCourse] = useState<Partial<Course>>({
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

  // Fetch courses and enrollments on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCourses = await coursesClient.fetchAllCourses();
        dispatch(setCourses(fetchedCourses));

        if (currentUser) {
          const userEnrollments = await enrollmentsClient.findEnrollmentsForUser(
            currentUser._id
          );
          setEnrollments(userEnrollments);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [dispatch, currentUser]);

  const isEnrolled = (courseId: string) => {
    if (!currentUser) return false;
    return enrollments.some(
      (enrollment) =>
        enrollment.user === currentUser._id && enrollment.course === courseId
    );
  };

  const enrolledCourses = currentUser
    ? courses.filter((c) => isEnrolled(c._id))
    : [];

  const displayedCourses = showAllCourses ? courses : enrolledCourses;

  const handleEnrollment = async (courseId: string) => {
    if (!currentUser) return;

    try {
      if (isEnrolled(courseId)) {
        await enrollmentsClient.unenrollFromCourse(currentUser._id, courseId);
      } else {
        await enrollmentsClient.enrollInCourse(currentUser._id, courseId);
      }
      // Refresh enrollments
      const updatedEnrollments = await enrollmentsClient.findEnrollmentsForUser(
        currentUser._id
      );
      setEnrollments(updatedEnrollments);
    } catch (error) {
      console.error("Error handling enrollment:", error);
      alert("Failed to update enrollment");
    }
  };

  const handleAddNewCourse = async () => {
    try {
      const newCourse = await coursesClient.createCourse(course);

      // Auto-enroll faculty in their created course
      if (currentUser && isFaculty) {
        await enrollmentsClient.enrollInCourse(currentUser._id, newCourse._id);
        const updatedEnrollments = await enrollmentsClient.findEnrollmentsForUser(
          currentUser._id
        );
        setEnrollments(updatedEnrollments);
      }

      // Refetch all courses from backend
      const fetchedCourses = await coursesClient.fetchAllCourses();
      dispatch(setCourses(fetchedCourses));

      setCourse({
        _id: "0",
        name: "New Course",
        number: "New Number",
        startDate: "2023-09-10",
        endDate: "2023-12-15",
        image: "/images/reactjs.jpg",
        description: "New Description",
      });
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course");
    }
  };

  const handleUpdateCourse = async () => {
    try {
      await coursesClient.updateCourse(course);
      
      // Refetch all courses from backend
      const fetchedCourses = await coursesClient.fetchAllCourses();
      dispatch(setCourses(fetchedCourses));
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course");
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await coursesClient.deleteCourse(courseId);
      
      // Refetch all courses from backend
      const fetchedCourses = await coursesClient.fetchAllCourses();
      dispatch(setCourses(fetchedCourses));
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course");
    }
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
          {showAllCourses ? "Enrolled Courses" : "All Courses"}
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

                    {showAllCourses && !isFaculty && (
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
                            handleDeleteCourse(c._id);
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