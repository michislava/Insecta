import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home/Home";
import LoginPage from "./pages/Login/Login";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        { path: "/", element: <HomePage /> },
        { path: "login", element: <LoginPage /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
