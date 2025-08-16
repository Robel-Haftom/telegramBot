import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const BingoBoard = ({ onMarkedNumbersChange }) => {
    const { calledNumbers } = useSelector(state => state.game);
    const { gameRoom } = useSelector(state => state.game);
    
    // State to track which numbers the player has marked on their board
    const [markedNumbers, setMarkedNumbers] = useState(new Set());
    
    const columns = {
        B: Array.from({ length: 15 }, (_, i) => i + 1),
        I: Array.from({ length: 15 }, (_, i) => i + 16),
        N: Array.from({ length: 15 }, (_, i) => i + 31),
        G: Array.from({ length: 15 }, (_, i) => i + 46),
        O: Array.from({ length: 15 }, (_, i) => i + 61),
    };

    const isNumberCalled = (number) => {
        return calledNumbers.includes(number);
    };
    
    const isNumberMarked = (number) => {
        return markedNumbers.has(number);
    };
    
    const toggleNumberMark = (number) => {
        // Player can mark ANY number on their card, not just called numbers
        setMarkedNumbers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(number)) {
                newSet.delete(number);
            } else {
                newSet.add(number);
            }
            return newSet;
        });
    };
    
    // Players manually mark numbers - no auto-marking
    // useEffect(() => {
    //     // Auto-mark numbers that are called but not yet marked
    //     const newMarkedNumbers = new Set(markedNumbers);
    //     calledNumbers.forEach(number => {
    //         if (!newMarkedNumbers.has(number)) {
    //                 newMarkedNumbers.add(number);
    //             }
    //         });
    //         setMarkedNumbers(newMarkedNumbers);
    //     }, [calledNumbers]);
    
    // Notify parent component when marked numbers change
    useEffect(() => {
        if (onMarkedNumbersChange) {
            onMarkedNumbersChange(markedNumbers);
        }
    }, [markedNumbers, onMarkedNumbersChange]);

    return (
        <div className='border-2 border-gray-300 w-full rounded-lg shadow-lg bg-white overflow-x-auto'>
            <table className="w-full h-full min-w-[150px]">
                <thead>
                    <tr className="h-6">
                        <th className="text-red-600 font-black text-xs bg-red-100 p-0.5">B</th>
                        <th className="text-yellow-600 font-black text-xs bg-yellow-100 p-0.5">I</th>
                        <th className="text-green-600 font-black text-xs bg-green-100 p-0.5">N</th>
                        <th className="text-blue-600 font-black text-xs bg-blue-100 p-0.5">G</th>
                        <th className="text-purple-600 font-black text-xs bg-purple-100 p-0.5">O</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 15 }).map((_, rowIndex) => (
                        <tr key={rowIndex} className="h-4">
                            {Object.keys(columns).map((letter) => {
                                const number = columns[letter][rowIndex];
                                const called = isNumberCalled(number);
                                
                                return (
                                    <td key={letter} className="p-0">
                                                                                 <div 
                                             className={`
                                                 p-0.5 m-0 border border-gray-300 rounded text-center font-semibold text-xs
                                                 transition-all duration-200 cursor-pointer hover:bg-gray-100
                                                 ${isNumberMarked(number)
                                                     ? 'bg-green-400 border-green-600 scale-105 shadow-md' 
                                                     : called
                                                     ? 'bg-yellow-300 border-yellow-500'
                                                     : 'bg-gray-50 border-gray-300'
                                                 }
                                             `}
                                             onClick={() => toggleNumberMark(number)}
                                             title={isNumberMarked(number) ? 'Click to unmark' : 'Click to mark'}
                                         >
                                                                                         <span className={
                                                 isNumberMarked(number) 
                                                     ? 'text-white font-bold' 
                                                     : called 
                                                     ? 'text-green-800 font-bold' 
                                                     : 'text-gray-700'
                                             }>
                                                 {letter}-{number}
                                             </span>
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BingoBoard;
