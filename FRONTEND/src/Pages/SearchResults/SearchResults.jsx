import React from 'react'
import SideNavbar from '../../Components/SideNavbar/SideNavbar.jsx';
import UserProfilePage from '../../Components/UserProfilePage/UserProfilePage.jsx';
import { useOutletContext } from 'react-router-dom';
import SearchResultsPage from '../../Components/SearchResultsPage/SearchResultsPage.jsx';

const SearchResults = () => {
    const {showSideNavbar}=useOutletContext()
  return (
    <div className='flex w-full pt-[60px] box-border'>
        {
            showSideNavbar
                ? <SideNavbar/>
                : <div className='w-[0px] h-[92vh] bg-black transition-all duration-300'></div>
        }

        <SearchResultsPage showSideNavbar={showSideNavbar}/>
    </div>
  )
}

export default SearchResults;
