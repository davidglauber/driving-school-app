import { router, useRootNavigationState } from "expo-router";
import { useEffect } from "react";

export default function index() {
  const navState = useRootNavigationState();

  useEffect(() => {
    if (navState.key) router.push("/auth/login");
  }, []);
  // it means: if navigation is ready, redirect to login page
}
