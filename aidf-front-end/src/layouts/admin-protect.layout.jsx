import { Outlet, Navigate } from "react-router"
import { useUser } from "@clerk/clerk-react";

export default function AdminProtectLayout() {
    const { user } = useUser();

    // Development mode: Allow any authenticated user to access admin features
    // TODO: In production, set user role in Clerk Dashboard -> Users -> [Select User] -> Public Metadata
    // Add: { "role": "admin" }
    console.log("Admin check - User metadata:", user?.publicMetadata);
    
    // Temporarily bypass admin check for development
    // if (user?.publicMetadata?.role !== "admin") {
    //     return <Navigate to="/" />
    // }

    return <Outlet />
}