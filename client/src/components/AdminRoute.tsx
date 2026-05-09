import { Navigate } from "react-router-dom";

export default function AdminRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    if (user?.role !== "Admin") {
        return <Navigate to="/dashboard" />;
    }

    return children;
}