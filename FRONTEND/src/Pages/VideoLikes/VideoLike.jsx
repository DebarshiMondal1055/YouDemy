
import SideNavbar from '../../Components/SideNavbar/SideNavbar.jsx';
import { useOutletContext } from 'react-router-dom';
import VideoLikePage from '../../Components/VideoLikePage/VideoLikePage.jsx';

const VideoLike = () => {
    const {showSideNavbar}=useOutletContext()
  return (
    <div className='flex w-full pt-[60px] box-border'>
        {
            showSideNavbar
                ? <SideNavbar/>
                : <div className='w-[0px] h-[92vh] bg-black transition-all duration-300'></div>
        }

        <VideoLikePage showSideNavbar={showSideNavbar}/>
    </div>
  )
}

export default VideoLike;
