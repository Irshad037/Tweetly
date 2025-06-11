import React from 'react'
import ConnectionSkeleton from '../../components/skeletons/ConnectionSkeleton';

const ConnectionsPage = () => {
  const isLoading = true;
   const isRefetching = true;;
  return (
    <div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen '>
      {/* HEADER */}
      {(isLoading || isRefetching) && <ConnectionSkeleton />}
      {!isLoading && !isRefetching && !user && <p className='text-center text-lg mt-4'>User not found</p>}
    </div>
  )
}

export default ConnectionsPage