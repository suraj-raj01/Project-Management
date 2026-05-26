import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromStorage } from "./helpers/GetUserInfo";
import AdminDashboard from "./helpers/AdminDashboard";
import UserDashboard from "./helpers/UserDashboard";
import SuperadminDashboard from "./helpers/SuperadminDashboard";
// ─── Dashboard 

export default function Dashboard() {
    const navigate = useNavigate();

    const user = getUserFromStorage();

    useEffect(() => {
        if (!user?._id) {
            navigate("/login");
        }
    }, []);

    return (
        <div className="">
            {user?.role === "Admin" ? (
                <AdminDashboard />
            ) : user.role === "Superadmin" ? (
                <SuperadminDashboard />
            ) : (
                <UserDashboard />
            )}
        </div>
    )
}