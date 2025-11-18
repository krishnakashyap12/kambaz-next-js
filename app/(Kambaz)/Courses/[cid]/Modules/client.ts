import axios from "axios";
import { Module } from "../../../types";

const axiosWithCredentials = axios.create({ withCredentials: true });

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const MODULES_API = `${HTTP_SERVER}/api/modules`;

export const findModulesForCourse = async (courseId: string): Promise<Module[]> => {
  const response = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/modules`);
  return response.data;
};

export const createModuleForCourse = async (
  courseId: string,
  module: Partial<Module>
): Promise<Module> => {
  const response = await axiosWithCredentials.post(
    `${COURSES_API}/${courseId}/modules`,
    module
  );
  return response.data;
};

export const deleteModule = async (moduleId: string): Promise<void> => {
  const response = await axiosWithCredentials.delete(`${MODULES_API}/${moduleId}`);
  return response.data;
};

export const updateModule = async (module: Module): Promise<Module> => {
  const response = await axiosWithCredentials.put(
    `${MODULES_API}/${module._id}`,
    module
  );
  return response.data;
};