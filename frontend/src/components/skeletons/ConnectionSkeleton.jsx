import React from 'react'

const ConnectionSkeleton = () => {
    return (
        <div className='flex flex-col gap-2 min-h-screen'>
            <div class="skeleton h-38 w-full">

                <div class="skeleton h-14 w-32 m-4"></div>
                <div class="skeleton h-14 w-full"></div>
            </div>
            <div className='flex gap-2 items-center m-10'>
                <div className='skeleton w-16 h-16 rounded-full shrink-0'></div>
                <div className='flex flex-1 justify-between'>
                    <div className='flex flex-col gap-1'>
                        <div className='skeleton h-4 w-48 rounded-full'></div>
                        <div className='skeleton h-4 w-32 rounded-full'></div>
                    </div>
                    <div className='skeleton h-10 w-20 rounded-full'></div>
                </div>
            </div>
            <div className='flex gap-2 items-center m-10'>
                <div className='skeleton w-16 h-16 rounded-full shrink-0'></div>
                <div className='flex flex-1 justify-between'>
                    <div className='flex flex-col gap-1'>
                        <div className='skeleton h-4 w-48 rounded-full'></div>
                        <div className='skeleton h-4 w-32 rounded-full'></div>
                    </div>
                    <div className='skeleton h-10 w-20 rounded-full'></div>
                </div>
            </div>
            <div className='flex gap-2 items-center m-10'>
                <div className='skeleton w-16 h-16 rounded-full shrink-0'></div>
                <div className='flex flex-1 justify-between'>
                    <div className='flex flex-col gap-1'>
                        <div className='skeleton h-4 w-48 rounded-full'></div>
                        <div className='skeleton h-4 w-32 rounded-full'></div>
                    </div>
                    <div className='skeleton h-10 w-20 rounded-full'></div>
                </div>
            </div>
            <div className='flex gap-2 items-center m-10'>
                <div className='skeleton w-16 h-16 rounded-full shrink-0'></div>
                <div className='flex flex-1 justify-between'>
                    <div className='flex flex-col gap-1'>
                        <div className='skeleton h-4 w-48 rounded-full'></div>
                        <div className='skeleton h-4 w-32 rounded-full'></div>
                    </div>
                    <div className='skeleton h-10 w-20 rounded-full'></div>
                </div>
            </div>
            <div className='flex gap-2 items-center m-10'>
                <div className='skeleton w-16 h-16 rounded-full shrink-0'></div>
                <div className='flex flex-1 justify-between'>
                    <div className='flex flex-col gap-1'>
                        <div className='skeleton h-4 w-48 rounded-full'></div>
                        <div className='skeleton h-4 w-32 rounded-full'></div>
                    </div>
                    <div className='skeleton h-10 w-20 rounded-full'></div>
                </div>
            </div>
        </div>
    );
}

export default ConnectionSkeleton