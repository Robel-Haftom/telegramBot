import { useDispatch } from "react-redux";
import { setSelectedCard } from "./store/selectedCardSlice"

const CardSelection = () =>{

    const dispatch = useDispatch();
    
    return(
        <div className="grid grid-cols-10 md:grid-cols-15 lg:grid-cols-20 gap-2">
            {Array.from({ length: 400 }, (_, i) => i + 1).map((num) => (
            <div onClick={() => dispatch(setSelectedCard(num - 1))} key={num} 
            className="border border-gray-400 rounded-md p-4 text-center w-6 h-6 flex items-center 
            justify-center cursor-pointer hover:scale-105 hover:border-black">
                {num}
            </div>
            ))}
        </div>
    )
}

export default CardSelection;