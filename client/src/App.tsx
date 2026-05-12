import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { lazy, Suspense } from "react";
import Docs from "./pages/docs/Docs";

// Layouts
const Layout = lazy(() => import("./layouts/Layout"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));

// Public Pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ChangePassword = lazy(() => import("./pages/auth/ChangePassword"));

// Dashboard Pages
const Dashboard = lazy(() => import("./pages/Dashboard"));

const Tasks = lazy(() => import("./pages/tasks/Tasks"));
const TaskView = lazy(() => import("./pages/tasks/TaskView"));
const TaskbyUser = lazy(() => import("./pages/tasks/TaskbyUser"));
const CreateTask = lazy(() => import("./pages/tasks/CreateTask"));

const Projects = lazy(() => import("./pages/projects/Projects"));
const ProjectForm = lazy(() => import("./pages/projects/ProjectForm"));

const Users = lazy(() => import("./pages/users/Users"));
const UserView = lazy(() => import("./pages/users/UserView"));
const CreateUser = lazy(() => import("./pages/users/CreateUser"));

function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="h-10 w-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>

          {/* Public Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="register" element={<Register />} />
            <Route path="docs" element={<Docs />} />
          </Route>

          {/* Dashboard Layout */}
          <Route path="/dashboard" element={<DashboardLayout />} >
            <Route index element={<Dashboard />} />
            {/* Tasks */}
            <Route path="tasks" element={<Tasks />} />
            <Route path="task-view/:id" element={<TaskView />} />
            <Route path="usertasks" element={<TaskbyUser />} />
            <Route path="create-task" element={<CreateTask />} />
            <Route path="create-task/:id" element={<CreateTask />} />

            {/* Projects */}
            <Route path="projects" element={<Projects />} />
            <Route
              path="projects/create"
              element={<ProjectForm />}
            />
            <Route
              path="projects/edit/:id"
              element={<ProjectForm />}
            />

            {/* Users */}
            <Route path="users" element={<Users />} />
            <Route
              path="users/:id/view"
              element={<UserView />}
            />
            <Route
              path="create-user"
              element={<CreateUser />}
            />
            <Route
              path="create-user/:id"
              element={<CreateUser />}
            />

            {/* Dashboard 404 */}
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center h-screen text-4xl font-bold">
                  404 Not Found
                </div>
              }
            />
          </Route>

          {/* Global 404 */}
          
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-screen text-4xl font-bold">
                404 Not Found
              </div>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}