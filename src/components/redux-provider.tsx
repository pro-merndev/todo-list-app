"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import type React from "react"; // Added import for React

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
