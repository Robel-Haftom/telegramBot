import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import BingoCard from "./BIngoCard";
import CardSelection from "./CardSelection";
import Header from "./Header";
import { getAllBingoCards } from "./store/allBingoCardsSlice";

const App = () => {
const [selectedCard, setSelectedCard] = useState(0)
const dispatch = useDispatch();
const {allBingoCards, status, error} = useSelector(state => state.bingoCards)
const selected = useSelector(state => state.selectedCard)

useEffect(() => {
  dispatch(getAllBingoCards())
}, []);
return(
<div className="flex flex-col gap-1 p-2 w-full h-screen">
  <Header />
  <div className="flex flex-col xl:flex-row gap-2 w-full h-full item-center justify-center">
    <div className="flex-3/5 border p-2 rounded-md overflow-y-scroll">
      <CardSelection />
    </div>
    <div className="flex-2/5 flex  justify-center">
    {
      <BingoCard bingoCard={allBingoCards[selected]}/>
    }
    </div>
  </div>
</div>
)
}
export default App
