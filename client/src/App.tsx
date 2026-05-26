import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { lazy, Suspense } from "react";
import Docs from "./pages/docs/Docs";
import PageNotFound from "./PageNotFound";
import CreateDiscussion from "./components/discussions/CreateTopic";
import Reply from "./components/discussions/Reply";
import Comments from "./components/discussions/Comments";
import Profile from "./components/Profile";
import ProjectView from "./pages/projects/ProjectView";
import Pricing from "./pages/subscriptions/Pricing";
import Payment from "./pages/subscriptions/Payment";
import Subscription from "./pages/subscriptions/Subscription";
import PaymentSuccess from "./components/PymentSuccess";
import PaymentFailed from "./components/PaymentFailed";
import Plans from "./pages/subscriptions/Plans";
import PaymentView from "./pages/subscriptions/PaymentView";
import Admins from "./pages/users/Admins";

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
const Discussion = lazy(() => import("./components/discussions/Discussion"));

function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
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
            <Route path="pricing" element={<Pricing />} />
            <Route path="payment/:plan" element={<Payment/>} />
            <Route path="success" element={<PaymentSuccess/>} />
            <Route path="failed" element={<PaymentFailed/>} />
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
            <Route path="projects/create" element={<ProjectForm />} />
            <Route path="projects/edit/:id" element={<ProjectForm />} />
            <Route path="projects/view/:id" element={<ProjectView />} />

            {/* Users */}
            <Route path="users" element={<Users />} />
            <Route path="users/:id/view" element={<UserView />} />
            <Route path="create-user" element={<CreateUser />} />
            <Route path="create-user/:id" element={<CreateUser />} />

            {/* Discussion */}
            <Route path="discussions" element={<Discussion />} />
            <Route path="create-discussion" element={<CreateDiscussion />} />
            <Route path="create-discussion/:id" element={<CreateDiscussion />} />
            <Route path="discussion/reply/:id" element={<Reply />} />
            <Route path="discussion/comments/:id" element={<Comments />} />
            <Route path="discussion/profile/:id" element={<Profile />} />

            {/* subscription */}
            <Route path="subscription" element={<Subscription />} />
            <Route path="admins" element={<Admins />} />
            <Route path="Subscribers" element={<Plans />} />
            <Route path="Subscribers/:id/view" element={<PaymentView />} />

            {/* Dashboard 404 */}
            <Route path="*" element={<PageNotFound />} />
          </Route>

          {/* Global 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}