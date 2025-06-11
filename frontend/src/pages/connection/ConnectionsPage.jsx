import React, { useState } from 'react'
import ConnectionSkeleton from '../../components/skeletons/ConnectionSkeleton';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";

const ConnectionsPage = () => {
  const [connectionType, setConnectionType] = useState("followers");
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const isLoading = false;
  const isRefetching = false;


  return (
    <div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen  '>
      {/* HEADER */}
      {(isLoading || isRefetching) && <ConnectionSkeleton />}

      <div className='flex items-center w-full gap-6 ml-4 mb-1'>

        <Link to={`/profile/${authUser.username}`}>
          <FaArrowLeftLong size={20} />
        </Link>

        <div className="flex flex-col items-start p-1">
          <h1 className="text-xl  font-bold ">{authUser.fullName}</h1>
          <h3 className="text-sm text-gray-500">@{authUser.username}</h3>
        </div>

      </div>

      <div className='flex w-full border-b border-b-gray-700'>
        <div
          className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
          onClick={() => setConnectionType("followers")}
        >
          Followers
          {connectionType === "followers" && (
            <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
          )}
        </div>
        <div
          className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
          onClick={() => setConnectionType("following")}
        >
          Following
          {connectionType === "following" && (
            <div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
          )}
        </div>
      </div>

      {!isLoading &&
        USERS_FOR_RIGHT_PANEL?.map((user) => (

          <Link
            to={`/profile/${user.username}`} className='flex items-center justify-between gap-4 m-8'
            key={user._id}
          >
            <div className='flex gap-2 items-center'>
              <div className='avatar'>
                <div className='w-12 rounded-full'>
                  <img src={authUser.profileImg || "/avatar-placeholder.png"} />
                </div>
              </div>
              <div className='flex flex-col'>
                <span className='font-semibold tracking-tight truncate w-32 ml-2'>
                  {user.fullName}
                </span>
                <span className='text-base text-slate-500 ml-2'>@{user.username}</span>
              </div>
            </div>
            <div>
              <button
                className='btn w-28 bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-md'
                onClick={(e) => e.preventDefault()}
              >
                Follow
              </button>
            </div>
          </Link>
        ))}
    </div>
  )
}

export default ConnectionsPage