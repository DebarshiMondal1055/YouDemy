import { useEffect } from 'react'
import './App.css'
import Navbar from './Components/Navbar/Navbar.jsx'
import { Outlet } from "react-router";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import HomePage from './Pages/HomePage/HomePage.jsx'
import VideoPage from './Pages/VideoPage/VideoPage.jsx'
import UserProfilePage from './Pages/UserProfilePage/UserProfilePage.jsx'
import VideoUpload from './Pages/VideoUpload/VideoUpload.jsx'
import Login from './Pages/Login/Login.jsx'
import SignUp from './Pages/SignUp/SignUp.jsx'
import WatchHistoryPage from './Pages/WatchHistoryPage/WatchHistoryPage.jsx'
import SubcriberPage from './Pages/SubscriberPage/SubcriberPage.jsx'
import VideoLikePage from './Pages/VideoLikePage/VideoLikePage.jsx'
import SearchResultsPage from './Pages/SearchResultsPage/SearchResultsPage.jsx'
import UserTweetPage from './Pages/UserTweetPage/UserTweetPage.jsx'
import UserCoursesPage from './Pages/UserCoursesPage/UserCoursesPage.jsx'
import UserDashboardPage from './Pages/UserDashboardPage/UserDashboardPage.jsx'
import MyCoursesPage from './Pages/MyCoursesPage/MyCoursesPage.jsx'
import PrivateRoute from './PrivateRoute/PrivateRoute.jsx'
import useAuthStore from './store/authStore.js'

function AppLayout() {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'watch/:videoId', element: <VideoPage /> },
      { path: 'results', element: <SearchResultsPage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <SignUp /> },
      { path: 'users/:username', element: <PrivateRoute><UserProfilePage /></PrivateRoute> },
      { path: ':userId/upload', element: <PrivateRoute><VideoUpload /></PrivateRoute> },
      { path: 'history', element: <PrivateRoute><WatchHistoryPage /></PrivateRoute> },
      { path: 'subscribers', element: <PrivateRoute><SubcriberPage /></PrivateRoute> },
      { path: 'likedVideos', element: <PrivateRoute><VideoLikePage /></PrivateRoute> },
      { path: 'users/:username/tweets', element: <PrivateRoute><UserTweetPage /></PrivateRoute> },
      { path: 'users/:username/courses', element: <PrivateRoute><UserCoursesPage /></PrivateRoute> },
      { path: 'channel/:userId', element: <PrivateRoute><UserDashboardPage /></PrivateRoute> },
      { path: 'courses', element: <PrivateRoute><MyCoursesPage /></PrivateRoute> },
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
