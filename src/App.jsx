import axios from "axios";
import { useState, useEffect } from "react";
import TicTacToe from "./TicTac";
import AIGame from "./AIGame"

const App = () => {


//   const [num1, setNum1] = useState("");
//   const [num2, setNum2] = useState("");
//   const [operator, setOperator] = useState("+");
//   const [result, setResult] = useState(null);

//   const handleCalculate = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("https://d77b498918c6.ngrok-free.app/calculate", {
//         num1: parseFloat(num1),
//         num2: parseFloat(num2),
//         operator
//       });
//       setResult(response.data.result);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   useEffect(() => {
//     if (window.Telegram?.WebApp) {
//       window.Telegram.WebApp.ready();
//     }
//   }, []);

//   return (
//     <form onSubmit={(e) => handleCalculate(e)} className="max-w-md border border-gray-600 mx-auto p-5 rounded-md my-10 flex flex-col gap-5">
//       <h2>Simple Calculator</h2>
//       <input
//         className="w-50 focus:outline-none border border-gray-400 focus:border-2 focus:border-blue-600 rounded p-2"
//         type="number"
//         placeholder="Number 1"
//         value={num1}
//         onChange={(e) => setNum1(e.target.value)}
//       />
//       <select className="w-25 border border-gray-400 p-2 rounded text-xl" value={operator} onChange={(e) => setOperator(e.target.value)}>
//         <option value="+">+</option>
//         <option value="-">−</option>
//         <option value="*">×</option>
//         <option value="/">÷</option>
//       </select>
//       <input        
//         className="w-50 border border-gray-400  focus:outline-none focus:border-2 focus:border-blue-600 rounded p-2"
//         type="number"
//         placeholder="Number 2"
//         value={num2}
//         onChange={(e) => setNum2(e.target.value)}
//       />
//       <button className="p-2 border border-gray-400 rounded-sm text-xl hover:bg-gray-400 hover:text-white cursor-pointer" type="submit">Calculate</button>
//       {result !== null && <h3>Result: {result}</h3>}
//     </form>
//   );
// }

return(
  // <TicTacToe />
  <AIGame />
)
}
export default App
