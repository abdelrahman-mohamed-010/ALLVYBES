import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useStore } from "../store/useStore";

export function AdminRoute() {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Wait for currentUser to be loaded (null means not logged in, undefined means not loaded)
    if (typeof currentUser === "undefined") return;
    setChecked(true);
    if (currentUser && !currentUser.isAdmin) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  if (!checked) return null;
  if (!currentUser || !currentUser.isAdmin) return null;
  return <Outlet />;
}
