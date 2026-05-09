import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Projects from "./pages/Projects";
import CreateTask from "./pages/CreateTask";
import Layout from "./layouts/Layout";
import TaskbyUser from "./pages/TaskbyUser";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import TaskView from "./pages/TaskView";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Dashboard Layout */}
        <Route path="/dashboard" element={<DashboardLayout />} >
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="task-view/:id" element={<TaskView />} />
          <Route path="task-by-user" element={<TaskbyUser />} />
          <Route path="projects" element={<Projects />} />
          <Route path="create-task" element={<CreateTask />} />
          <Route path="users" element={<Users />} />
          <Route path="create-user" element={<CreateUser />} />
          <Route path="create-task/:id" element={<CreateTask />} />
        </Route>

        {/* 404 */}

        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen text-4xl font-bold">
              404 Not Found
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}