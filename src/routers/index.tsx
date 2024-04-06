import { default as Pages } from "../pages";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

export default function Routers() {
  const routers = Object.entries(Pages).map(([nameScreen, Component]) => {
    nameScreen = nameScreen == "Home" ? "/" : nameScreen;

    return {
      path: nameScreen,
      element: <Component />,
    };
  });

  return <RouterProvider router={createBrowserRouter([...routers])} />;
}
