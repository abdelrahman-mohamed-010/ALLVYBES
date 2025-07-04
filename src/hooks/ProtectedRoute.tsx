import { useEffect, useRef, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";
import { VybesLoader } from "../components/UI/VybesLoader";

// Debounce loader to avoid flashing due to quick loading toggles
export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);
  const loaderTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only show loader if loading stays true for 200ms
    if (loading) {
      loaderTimeout.current = setTimeout(() => setShowLoader(true), 200);
    } else {
      setShowLoader(false);
      if (loaderTimeout.current) {
        clearTimeout(loaderTimeout.current);
        loaderTimeout.current = null;
      }
    }
    return () => {
      if (loaderTimeout.current) {
        clearTimeout(loaderTimeout.current);
        loaderTimeout.current = null;
      }
    };
  }, [loading]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (showLoader) return <VybesLoader />;
  // Custom element rendering to pass user/loading to AdminRoute
  return <Outlet context={{ user, loading }} />;
}
