import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import { ToastProvider } from "react-toast-notifications";

test("renders learn react link", () => {
  const { getByText } = render(
    <ToastProvider>
      <App />
    </ToastProvider>
  );
  const linkElement = getByText(/Log in/i);
  expect(linkElement).toBeInTheDocument();
});
