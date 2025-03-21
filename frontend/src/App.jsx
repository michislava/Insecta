import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home/Home";
import LoginPage from "./pages/Login/Login";
import RootPage from "./pages/Root/Root";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootPage />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "login", element: <LoginPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
