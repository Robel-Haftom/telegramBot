import { useSelector } from "react-redux";

const BingoCard = ({bingoCard}) => {
    const {calledNumbers} = useSelector(state => state.game)

    // Check if a number is called
    const isNumberCalled = (number) => {
        return calledNumbers.includes(number);
    };

    if (!bingoCard) {
        return (
            <div className="w-full max-w-56 h-auto aspect-square bg-green-300 flex items-center justify-center rounded-lg">
                <div className="w-2/3 h-2/3 rounded-full animate-spin border-4 border-gray-500 border-b-transparent"></div>
            </div>
        );
    }

    return(
        <div className="w-full max-w-56 h-auto aspect-square bg-green-300 rounded-lg shadow-lg">
            <table className="border-collapse w-full h-full bg-green-300 rounded-lg overflow-hidden">
                <thead>
                    <tr className="h-5">
                        <th colSpan={5} className="text-xs font-semibold text-gray-700 bg-green-400">
                            Card #{bingoCard?.cardCode}
                        </th>
                    </tr>
                    <tr className="h-6">
                        <th className="text-red-600 font-black text-xs bg-red-100">B</th>
                        <th className="text-yellow-600 font-black text-xs bg-yellow-100">I</th>
                        <th className="text-green-600 font-black text-xs bg-green-100">N</th>
                        <th className="text-blue-600 font-black text-xs bg-blue-100">G</th>
                        <th className="text-purple-600 font-black text-xs bg-purple-100">O</th>
                    </tr>
                </thead>
                <tbody>
                    { 
                        bingoCard?.cardNumbers?.map((row, rowIndex) => (
                            <tr key={rowIndex} className="h-8">
                                {row?.map((number, colIndex) => (
                                    <td 
                                        key={colIndex} 
                                        className={`
                                            p-0.5 text-center border border-gray-400 font-semibold text-xs
                                            transition-all duration-200
                                            ${isNumberCalled(number) 
                                                ? 'bg-yellow-300 scale-105 shadow-inner' 
                                                : 'bg-white hover:bg-green-100'
                                            }
                                            ${number === 0 ? 'bg-gray-200' : ''}
                                        `}
                                    >
                                        <span className={`
                                            ${isNumberCalled(number) ? 'text-green-800 font-bold' : 'text-gray-700'}
                                            ${number === 0 ? 'text-gray-500' : ''}
                                        `}>
                                            {number === 0 ? "★" : number}
                                        </span>
                                    </td>
                                ))}
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default BingoCard;