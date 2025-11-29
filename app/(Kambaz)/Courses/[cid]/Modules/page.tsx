"use client";
import { useParams } from "next/navigation";
import { ListGroup, ListGroupItem, FormControl } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import LessonControlButtons from "./LessonControlButtons";
import ModuleControlButtons from "./ModuleControlButtons";
import { RootState } from "../../../store";
import {
  addModule,
  editModule,
  updateModule,
  deleteModule,
  setModules,
  stopEditingModule,
} from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import * as client from "./client";
import { Module } from "../../../types";

export default function Modules() {
  const { cid } = useParams();
  const { modules } = useSelector((state: RootState) => state.modulesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";
  const dispatch = useDispatch();
  const [moduleName, setModuleName] = useState("");

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const fetchedModules = await client.findModulesForCourse(cid as string);
        dispatch(setModules(fetchedModules));
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };
    fetchModules();
  }, [cid, dispatch]);

  const handleAddModule = async () => {
    if (!moduleName.trim()) return;

    try {
      const newModule = await client.createModuleForCourse(cid as string, {
        name: moduleName.trim(),
        course: cid as string,
      });
      dispatch(addModule(newModule));
      setModuleName("");
    } catch (error) {
      console.error("Error creating module:", error);
      alert("Failed to create module");
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;

    try {
      await client.deleteModule(moduleId);
      dispatch(deleteModule(moduleId));
    } catch (error) {
      console.error("Error deleting module:", error);
      alert("Failed to delete module");
    }
  };

  const handleUpdateModule = async (module: Module) => {
    try {
      const updatedModule = await client.updateModule(module);
      // Ensure editing is set to false after update
      dispatch(updateModule({ ...updatedModule, editing: false }));
    } catch (error) {
      console.error("Error updating module:", error);
      alert("Failed to update module");
    }
  };

  return (
    <div>
      <ModulesControls
        setModuleName={setModuleName}
        moduleName={moduleName}
        isFaculty={isFaculty}
        addModule={handleAddModule}
      />

      <br />
      <br />
      <br />
      <br />

      <ListGroup id="wd-modules" className="rounded-0">
        {modules
          .filter((module: Module) => module.course === cid)
          .map((module: Module) => (
            <ListGroupItem
              key={module._id}
              className="wd-module p-0 mb-5 fs-5 border-gray"
            >
              <div className="wd-title p-3 ps-2 bg-secondary">
                <BsGripVertical className="me-2 fs-3" />

                {(!module.editing || !isFaculty) && module.name}

                {isFaculty && module.editing && (
                  <FormControl
                    className="w-50 d-inline-block"
                    value={module.name || ""}
                    onChange={(e) => {
                      const updatedModule = { ...module, name: e.target.value };
                      dispatch(updateModule(updatedModule));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const inputValue = (e.target as HTMLInputElement).value.trim();
                        if (inputValue) {
                          // Immediately stop editing to hide the text box
                          dispatch(stopEditingModule(module._id));
                          // Update the name in Redux immediately for better UX
                          dispatch(updateModule({ ...module, name: inputValue, editing: false }));
                          // Then save to server (this will update with server response)
                          const moduleToUpdate = { ...module, name: inputValue };
                          handleUpdateModule(moduleToUpdate).catch(() => {
                            // If update fails, restore editing mode
                            dispatch(editModule(module._id));
                          });
                        }
                      }
                    }}
                  />
                )}

                {isFaculty && (
                  <ModuleControlButtons
                    moduleId={module._id}
                    deleteModule={handleDeleteModule}
                    editModule={(moduleId) => dispatch(editModule(moduleId))}
                  />
                )}
              </div>

              {module.lessons && (
                <ListGroup className="wd-lessons rounded-0">
                  {module.lessons.map((lesson) => (
                    <ListGroupItem
                      key={lesson._id}
                      className="wd-lesson p-3 ps-1"
                    >
                      <BsGripVertical className="me-2 fs-3" /> {lesson.name}{" "}
                      <LessonControlButtons />
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </ListGroupItem>
          ))}
      </ListGroup>
    </div>
  );
}