import { useEffect, useState } from "react"

const BingoCard = ({bingoCard}) =>{
    return(
        <div className="w-80 h-80 bg-green-300 flex items-center justify-center">
        {
            bingoCard ? (
                <table className="border w-80 h-80 bg-green-300">
                <thead className="rounded-md">
                    <tr className="h-5 text-xl">
                        <th colSpan={5}>{bingoCard?.cardCode + 1}</th>
                    </tr>
                    <tr className="h-15 text-2xl">
                        <th className="text-red-600 font-black">B</th>
                        <th className="text-yellow-600 font-black">I</th>
                        <th className="text-green-600 font-black">N</th>
                        <th className="text-blue-600 font-black">G</th>
                        <th className="text-purple-600 font-black">O</th>
                    </tr>
                </thead>
                <tbody>
                    { 
                        bingoCard?.cardNumbers?.map((row, index) =>(
                            <tr className="text-center text-xl font-semibold" key={index}>{row?.map((col, i) =>(
                                <td className="p-2 text-center border w-1/5" key={i}>{col == 0 ? "*" : col }</td>
                            ))}</tr>
                        ))
                    }
                </tbody>
            </table>
            ) :
            (
                <div className="w-2/3 h-2/3 rounded-full animate-spin border-3 border-gray-500 border-b-transparent ">

                </div>
            )
        }
        
        </div>
       

    )
}

export default BingoCard;