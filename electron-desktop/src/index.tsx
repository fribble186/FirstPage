import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./pages/App";
import Welcome from "./pages/welcome";
import ShortCuts from "./pages/shortcuts";
import Services from "./pages/services";
import Chat from "./pages/chat";
import Settings from "./pages/settings";
import JsonConfig from "./pages/jsonConfig";
import { createHashRouter, RouterProvider } from "react-router-dom";

const router = createHashRouter([
  {
    path: "/",
    element: <App />, // 使用 Layout 组件作为父路由
    children: [
      {
        path: "/",
        element: <Welcome />, // 默认子路由
      },
      {
        path: "shortcuts",
        element: <ShortCuts />, // 子路由
      },
      {
        path: "services",
        element: <Services />, // 子路由
      },
      {
        path: "chat",
        element: <Chat />, // 子路由
      },
      {
        path: "settings",
        element: <Settings />, // 子路由
      },
    ],
  },
  {
    path: "/config",
    element: <JsonConfig />,
  },
]);

const root = ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById("root") as HTMLElement
);
