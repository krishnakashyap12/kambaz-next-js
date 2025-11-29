"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setCourses } from "../Courses/reducer";
import * as coursesClient from "../Courses/client";
import * as userClient from "../Account/client";
import { Course } from "./../types";
import { Card, Row, Col, Button, FormControl } from "react-bootstrap";

export default function Dashboard() {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const dispatch = useDispatch();

  const [course, setCourse] = useState<Partial<Course>>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  const [enrolling, setEnrolling] = useState<boolean>(false);

  const isFaculty = currentUser?.role === "FACULTY";

  const findCoursesForUser = async () => {
    try {
      if (!currentUser) return;
      const userCourses = await userClient.findCoursesForUser(currentUser._id);
      dispatch(setCourses(userCourses));
    } catch (error) {
      console.error("Error fetching user courses:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      if (!currentUser) return;
      const allCourses = await coursesClient.fetchAllCourses();
      const enrolledCourses = await userClient.findCoursesForUser(currentUser._id);
      const coursesWithEnrollment = allCourses.map((c: Course) => {
        if (enrolledCourses.find((ec: Course) => ec._id === c._id)) {
          return { ...c, enrolled: true };
        } else {
          return c;
        }
      });
      dispatch(setCourses(coursesWithEnrollment));
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    if (enrolling) {
      fetchCourses();
    } else {
      findCoursesForUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, enrolling]);

  const updateEnrollment = async (courseId: string, enrolled: boolean) => {
    if (!currentUser) return;
    try {
      if (enrolled) {
        await userClient.enrollIntoCourse(currentUser._id, courseId);
      } else {
        await userClient.unenrollFromCourse(currentUser._id, courseId);
      }
      const updatedCourses = courses.map((c) => {
        if (c._id === courseId) {
          return { ...c, enrolled: enrolled };
        } else {
          return c;
        }
      });
      dispatch(setCourses(updatedCourses));
    } catch (error) {
      console.error("Error updating enrollment:", error);
    }
  };

  const handleAddNewCourse = async () => {
    try {
      const newCourse = await coursesClient.createCourse(course);

      // Refetch courses from backend
      if (enrolling) {
        await fetchCourses();
      } else {
        await findCoursesForUser();
      }

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
        Dashboard
        <Button
          variant="primary"
          className="float-end"
          onClick={() => setEnrolling(!enrolling)}
        >
          {enrolling ? "My Courses" : "All Courses"}
        </Button>
      </h2>
      <hr />

      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {courses.map((c: Course & { enrolled?: boolean }) => (
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

                    {enrolling && (
                      <Button
                        variant={c.enrolled ? "danger" : "success"}
                        className="float-end ms-2"
                        onClick={(e) => {
                          e.preventDefault();
                          updateEnrollment(c._id, !c.enrolled);
                        }}
                      >
                        {c.enrolled ? "Unenroll" : "Enroll"}
                      </Button>
                    )}

                    {isFaculty && !enrolling && (
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