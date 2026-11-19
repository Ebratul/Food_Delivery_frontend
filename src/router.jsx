import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import ProtectedRoute, { GuestRoute } from "./components/layout/ProtectedRoute.jsx";
import RouteError from "./pages/RouteError.jsx";

// every page is code-split into its own chunk
const Home = lazy(() => import("./pages/Home.jsx"));
const Explore = lazy(() => import("./pages/Explore.jsx"));
const RestaurantDetails = lazy(() => import("./pages/RestaurantDetails.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Blog = lazy(() => import("./pages/Blog.jsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.jsx"));
const About = lazy(() => import("./pages/static/About.jsx"));
const Contact = lazy(() => import("./pages/static/Contact.jsx"));
const Help = lazy(() => import("./pages/static/Help.jsx"));
const Privacy = lazy(() => import("./pages/static/Legal.jsx").then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import("./pages/static/Legal.jsx").then((m) => ({ default: m.Terms })));
const Login = lazy(() => import("./pages/auth/Login.jsx"));
const Register = lazy(() => import("./pages/auth/Register.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

const Overview = lazy(() => import("./pages/dashboard/Overview.jsx"));
const MyOrders = lazy(() => import("./pages/dashboard/MyOrders.jsx"));
const OrderDetails = lazy(() => import("./pages/dashboard/OrderDetails.jsx"));
const MyRestaurants = lazy(() => import("./pages/dashboard/MyRestaurants.jsx"));
const RestaurantForm = lazy(() => import("./pages/dashboard/RestaurantForm.jsx"));
const MyReviews = lazy(() => import("./pages/dashboard/MyReviews.jsx"));
const Profile = lazy(() => import("./pages/dashboard/Profile.jsx"));
const ManageUsers = lazy(() => import("./pages/dashboard/admin/ManageUsers.jsx"));
const ManageRestaurants = lazy(() => import("./pages/dashboard/admin/ManageRestaurants.jsx"));
const ManageOrders = lazy(() => import("./pages/dashboard/admin/ManageOrders.jsx"));
const ManageCategories = lazy(() => import("./pages/dashboard/admin/ManageCategories.jsx"));
const Messages = lazy(() => import("./pages/dashboard/admin/Messages.jsx"));

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: "explore", element: <Explore /> },
      { path: "restaurants/:slug", element: <RestaurantDetails /> },
      { path: "cart", element: <Cart /> },
      { path: "blog", element: <Blog /> },
      { path: "blog/:slug", element: <BlogPost /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "help", element: <Help /> },
      { path: "privacy", element: <Privacy /> },
      { path: "terms", element: <Terms /> },
      { path: "login", element: <GuestRoute><Login /></GuestRoute> },
      { path: "register", element: <GuestRoute><Register /></GuestRoute> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "dashboard",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Overview /> },
      { path: "orders", element: <MyOrders /> },
      { path: "orders/:id", element: <OrderDetails /> },
      { path: "restaurants", element: <MyRestaurants /> },
      { path: "restaurants/new", element: <RestaurantForm /> },
      { path: "restaurants/:id/edit", element: <RestaurantForm /> },
      { path: "reviews", element: <MyReviews /> },
      { path: "profile", element: <Profile /> },
      {
        path: "admin",
        element: <ProtectedRoute roles={["ADMIN"]} />,
        children: [
          { path: "users", element: <ManageUsers /> },
          { path: "restaurants", element: <ManageRestaurants /> },
          { path: "orders", element: <ManageOrders /> },
          { path: "categories", element: <ManageCategories /> },
          { path: "messages", element: <Messages /> },
        ],
      },
    ],
  },
]);
