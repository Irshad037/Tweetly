import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { CiSearch } from "react-icons/ci";
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useFollow from '../../components/hooks/useFollow';
import { Link } from 'react-router-dom';

const SearchPage = () => {
    const [text, setText] = useState("");
    const [query, setQuery] = useState("");
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const { data: searchUser, isLoading, error } = useQuery({
        queryKey: ["searchProfile", query],
        queryFn: async () => {
            if (!query) return null; // Avoid fetching with empty query
            const res = await fetch(`/api/users/profile/${query}`);
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }
            return data;
        },
        enabled: !!query, // Only fetch when `query` is truthy
    });

    const handleSearch = () => {
        setQuery(text);
    };

    const { follow, isPending } = useFollow();
    const checkFollowing = (userId) => {
        return authUser?.following?.includes(userId);
    };

    return (
        <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen px-7 pt-2 gap-10">
            {/* Search Input */}
            <div className="w-full flex items-center justify-center p-2.5 border rounded-full">
                <CiSearch
                    className="w-6 h-6 cursor-pointer"
                    onClick={handleSearch}
                />
                <input
                    placeholder="Search"
                    className="flex-1 bg-transparent border-none outline-none ml-2"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>

            {/* Results Section */}
            <div className="mt-4">
                {isLoading &&
                    <div className='flex items-center justify-center'>
                        <LoadingSpinner size='md' />
                    </div>
                }

                {error && <p className="text-red-500 flex items-center justify-center">User not found</p>}

                {!searchUser && !isLoading && !error && (
                    <div className='flex justify-center flex-col gap-4 m-8'>
                        <Link className='text-blue-700 text-4xl '>#frontend</Link>
                        <Link className='text-blue-700 text-4xl '>#backend</Link>
                        <Link className='text-blue-700 text-4xl '>#MERN</Link>
                        <Link className='text-blue-700 text-4xl '>#LatestNews</Link>
                        <Link className='text-blue-700 text-4xl '>#webdeveploment</Link>
                        <Link className='text-blue-700 text-4xl '>#html</Link>
                        <Link className='text-blue-700 text-4xl '>#express</Link>
                    </div>
                )}
                {searchUser && !isLoading && (

                    <Link
                        to={`/profile/${searchUser.username}`}
                        className="flex items-center justify-between gap-4 m-8"

                    >
                        <div className="flex gap-2 items-center">
                            <div className="avatar">
                                <div className="w-12 rounded-full">
                                    <img src={searchUser.profileImg || "/avatar-placeholder.png"} alt="avatar" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold tracking-tight truncate w-32 ml-2">
                                    {searchUser.fullName}
                                </span>
                                <span className="text-base text-slate-500 ml-2">@{searchUser.username}</span>
                            </div>
                        </div>
                        <div>
                            <button
                                className="btn w-28 bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-md"
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent the link navigation
                                    follow(searchUser?._id);
                                }}
                            >
                                {isPending ? "Loading..." : checkFollowing(searchUser?._id) ? "Unfollow" : "Follow"}
                            </button>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
