import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./pages/Home/Home";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: HomePage,
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
