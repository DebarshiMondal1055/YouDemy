import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Home from './Pages/Home.jsx'
import Video from './Pages/Video/Video.jsx'
import UserProfile from './Pages/UserProfile/UserProfile.jsx'
import VideoUpload from './Pages/VideoUpload/VideoUpload.jsx'
import Login from './Pages/Login/Login.jsx'
import SignUp from './Pages/SignUp/SignUp.jsx'
import {QueryClient,useQuery, QueryClientProvider} from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import WatchHistory from './Pages/WatchHistory/WatchHistory.jsx'
import Subscribers from './Pages/Subscribers/Subscribers.jsx'
import VideoLike from './Pages/VideoLikes/VideoLike.jsx'
import SearchResults from './Pages/SearchResults/SearchResults.jsx'
import UserTweet from './Pages/UserTweet/UserTweet.jsx'
import UserCourses from './Pages/UserCourses/UserCourses.jsx'
import UserDashboard from './Pages/UserDashboard/UserDashboard.jsx'
import MyCourses from './Pages/MyCourses/MyCourses.jsx'
import PrivateRoute from './PrivateRoute/PrivateRoute.jsx'
import axios from 'axios'
function RootRedirect() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/v1/users/get-user', { withCredentials: true });
        return response.status >= 200 && response.status < 300 ? response.data.data : null;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>Loading...</div>; // Optional: Add a loading state
  }
  
  if (user && user._id && user.username) {
    return <Navigate to={`/users/${user.username}`} replace />;
  }
  return <Navigate to="/login" replace />;
}


const router=createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {
        index: true, 
        element: <RootRedirect />, 
      },
      
      {
        path:'home',
        
        element:<PrivateRoute>
                <Home/>
              </PrivateRoute>
        
      },
      {
        path:'watch/:videoId',
        element:<PrivateRoute>
          <Video/>
        </PrivateRoute>
      },
      {
        path:'users/:username',
        element:<PrivateRoute>
        <UserProfile/>
        </PrivateRoute>,
      },
      {
        path:':userId/upload',
        element:<PrivateRoute>
          <VideoUpload/>
        </PrivateRoute>
      },
      {
        path:'login',
        element:<Login/>
      },
      {
        path:'register',
        element:<SignUp/>
      },
      {
        path:'history',
        element:<PrivateRoute>
          <WatchHistory/>
        </PrivateRoute>
      },
      {
        path:'subscribers',
        element:<PrivateRoute>
          <Subscribers/>
        </PrivateRoute>
      },
      {
        path:'likedVideos',
        element:<PrivateRoute>
          <VideoLike/>
        </PrivateRoute>
      },
      {
        path:'/results',
        element:<PrivateRoute>
        <SearchResults/>
        </PrivateRoute>
      },
      {
        path:'users/:username/tweets',
        element:<PrivateRoute>
        <UserTweet/>
        </PrivateRoute>
      },
      {
        path:'users/:username/courses',
        element:<PrivateRoute>
        <UserCourses/>
        </PrivateRoute>
      },
      {
        path:'channel/:userId',
        element:<PrivateRoute>
          <UserDashboard/>
        </PrivateRoute>
      },
      {
        path:'courses',
        element:<PrivateRoute>
          <MyCourses/>
        </PrivateRoute>
      }
    ]
  }
])
const queryClient=new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
