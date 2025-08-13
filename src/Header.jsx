import React from 'react'

const Header = () => {
    const gameStarted = false;
  return (
    <div className='flex items-stretch justify-between py-1 w-full gap-2 sm:gap-5'>
        {
            gameStarted ? (
                <>
                <div className='border border-gray-300 w-1/4 text-center p-1 rounded-md shadow-sm text-lg font-semibold'>
                    <p>Derash</p>
                    <p>500 birr</p>
                </div>
                <div className='border border-gray-300 w-1/4 text-center p-1 rounded-md shadow-sm text-lg font-semibold'>
                    <p>Players</p>
                    <p>50</p>
                </div>
                <div className='border border-gray-300 w-1/4 text-center p-1 rounded-md shadow-sm text-lg font-semibold'>
                    <p>Bet</p>
                    <p>10 birr</p>
                </div>
                <div className='border border-gray-300 w-1/4 text-center p-1 rounded-md shadow-sm text-lg font-semibold'>
                    <p>Call</p>
                    <p>10</p>
                </div>
                </>
            ) : (
                <>
                    <div className='border border-gray-300 w-1/3 text-center p-1 rounded-md shadow-sm text-lg font-semibold '>
                        <p>30</p>
                    </div>
                    <div className='border border-gray-300 w-1/3 text-center p-1 rounded-md shadow-sm text-lg font-semibold '>
                        <p>Wallet</p>
                        <p>50</p>
                    </div>
                    <div className='border border-gray-300 w-1/3 text-center p-1 rounded-md shadow-sm text-lg font-semibold '>
                        <p>Stake</p>
                        <p>10 birr</p>
                    </div>
                </>
            )
        }
    </div>
  )
}

export default Header