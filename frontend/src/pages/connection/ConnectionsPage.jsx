import React, { useState } from "react";
import ConnectionSkeleton from "../../components/skeletons/ConnectionSkeleton";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";
import useFollow from "../../components/hooks/useFollow";

const ConnectionsPage = () => {
  const [connectionType, setConnectionType] = useState("followers");
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { username } = useParams();

  const {
    data: userinfo,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { data: followingUsers, isLoading: loadingFollowing, isRefetching } = useQuery({
    queryKey: ["followingUsers"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}/following`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { data: userFollwers, isLoading: loadingFollowers } = useQuery({
    queryKey: ["userFollwers"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}/follower`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { follow, isPending } = useFollow();

  const checkFollowing = (userId) => {
    return authUser?.following?.includes(userId);
  };




  return (
    <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
      {/* HEADER */}
      {(loadingFollowing || isRefetching || loadingFollowers) && <ConnectionSkeleton />}
      {!loadingFollowing && !loadingFollowers && !isRefetching && (
        <>
          <div className="flex items-center w-full gap-6 ml-4 mb-1">
            <Link to={`/profile/${userinfo?.username}`}>
              <FaArrowLeftLong size={20} />
            </Link>

            <div className="flex flex-col items-start p-1">
              <h1 className="text-xl font-bold">{userinfo?.fullName}</h1>
              <h3 className="text-sm text-gray-500">@{userinfo?.username}</h3>
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

          {/* Connections List */}
          {!loadingFollowers && !userFollwers?.length && connectionType === "followers" && (
            <p className="text-center my-4">No followers found.</p>
          )}
          {!loadingFollowing && !followingUsers?.length && connectionType === "following" && (
            <p className="text-center my-4">No users followed.</p>
          )}


          {connectionType === "following" && (

            followingUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4 m-8"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img src={user.profileImg || "/avatar-placeholder.png"} alt="avatar" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-32 ml-2">
                      {user.fullName}
                    </span>
                    <span className="text-base text-slate-500 ml-2">@{user.username}</span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn w-28 bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-md"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the link navigation
                      follow(user?._id);
                    }}
                  >
                    {isPending ? "Loading..." : checkFollowing(user?._id) ? "Unfollow" : "Follow"}
                  </button>
                </div>
              </Link>
            ))
          )}

          {connectionType === "followers" && (

            userFollwers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4 m-8"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img src={user.profileImg || "/avatar-placeholder.png"} alt="avatar" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-32 ml-2">
                      {user.fullName}
                    </span>
                    <span className="text-base text-slate-500 ml-2">@{user.username}</span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn w-28 bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-md"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the link navigation
                      follow(user?._id);
                    }}
                  >
                    {authUser._id === userinfo._id
                      ? "Remove" // Show "Remove" when viewing own connections
                      : isPending
                        ? "Loading..."
                        : checkFollowing(user?._id)
                          ? "Unfollow"
                          : "Follow"}
                  </button>

                </div>
              </Link>
            ))
          )}
        </>
      )
      }
    </div >
  );
};

export default ConnectionsPage;




