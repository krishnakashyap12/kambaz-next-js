"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import { Form, Row, Col, Button } from "react-bootstrap";

// Define Profile type
interface Profile {
  _id?: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  email?: string;
  role?: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile>({});
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer
  );

  const fetchProfile = () => {
    if (!currentUser) return router.push("/Account/Signin");
    setProfile(currentUser);
  };

  const signout = () => {
    dispatch(setCurrentUser(null));
    router.push("/Account/Signin");
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="wd-profile-screen" style={{ maxWidth: 420 }}>
      <h1 className="mb-3">Profile</h1>

      {profile && (
        <Form>
          <Form.Control
            defaultValue={profile.username}
            placeholder="username"
            className="mb-2"
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
          />
          <Form.Control
            defaultValue={profile.password}
            placeholder="password"
            type="password"
            className="mb-2"
            onChange={(e) =>
              setProfile({ ...profile, password: e.target.value })
            }
          />
          <Form.Control
            defaultValue={profile.firstName}
            placeholder="First Name"
            className="mb-2"
            onChange={(e) =>
              setProfile({ ...profile, firstName: e.target.value })
            }
          />
          <Form.Control
            defaultValue={profile.lastName}
            placeholder="Last Name"
            className="mb-2"
            onChange={(e) =>
              setProfile({ ...profile, lastName: e.target.value })
            }
          />

          <Row className="mb-2">
            <Col>
              <Form.Control
                defaultValue={profile.dob}
                type="date"
                onChange={(e) =>
                  setProfile({ ...profile, dob: e.target.value })
                }
              />
            </Col>
          </Row>

          <Form.Control
            defaultValue={profile.email}
            type="email"
            placeholder="email"
            className="mb-2"
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
          />

          <Form.Select
            value={profile.role}
            className="mb-3"
            onChange={(e) =>
              setProfile({ ...profile, role: e.target.value })
            }
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="FACULTY">Faculty</option>
            <option value="STUDENT">Student</option>
          </Form.Select>

          <Button
            variant="danger"
            className="w-100"
            onClick={signout}
          >
            Signout
          </Button>
        </Form>
      )}
    </div>
  );
}