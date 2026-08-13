"use client";

import { useEffect, useState } from "react";

// localStorage-backed shared login flag — needed because this project has no
// shared layout wrapping every route (each page is its own independent
// route tree), so a query-param-only flag would only ever reach the one
// component reading it on that specific page load. Same "fake auth"
// convention already used by wu88-demo/lifehigh-demo's own useLoggedIn.
const STORAGE_KEY = "jinDemoLoggedIn";

export function useLoggedIn(): [boolean, (value: boolean) => void] {
  const [loggedIn, setLoggedInState] = useState(false);

  useEffect(() => {
    setLoggedInState(window.localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  function setLoggedIn(value: boolean) {
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    setLoggedInState(value);
  }

  return [loggedIn, setLoggedIn];
}
