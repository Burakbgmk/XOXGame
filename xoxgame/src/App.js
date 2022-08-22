import './App.css';
import Table from './Table';
import Square from './Square';
import {useEffect, useState} from "react";

const defaultMarks = () => (new Array(9)).fill(null);

const lines = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6],
];

function App() {
  const [marks, setMarks] = useState(defaultMarks());
  const [winner, setWinner] = useState("");
  const [gameMode, setGameMode] = useState(0);
  const [turn, setTurn] = useState('x');

  
  
  
  const delay = ms => new Promise(res => setTimeout(res, ms));
  
  const moveOfThePlayer = (index,letter) => {
    let newMarks = marks;
    if(newMarks[index]!==null) return;
    newMarks[index] = letter;
    setMarks([...newMarks]);
  }

  

  useEffect(() => {
    const isFirstPlayerTurn = marks.filter(mark => mark !== null).length % 2 === 0;
    if(isFirstPlayerTurn) setTurn('x');
    else setTurn('o');
    console.log(turn);
  },[turn,marks])

  function handleSquareClick(index){
    if(winner !== "" || gameMode===0) return;
    if (turn==='x') {
      moveOfThePlayer(index,'x');
      return;
    }
    moveOfThePlayer(index,'o');
  }
  

   

  

  useEffect( ()  => {
    const isComputerTurn = marks.filter(mark => mark !== null).length % 2 === 1;

    const linesThatAre = (a,b,c) => {
      return lines.filter(squareIndexes => {
        const squareValues = squareIndexes.map(index => marks[index]);
        return JSON.stringify([a,b,c].sort()) === JSON.stringify(squareValues.sort());
      });
    };

    const emptyIndexes = marks
    .map((square,index) => square === null ? index : null)
    .filter(val => val !== null);

    const xWon = linesThatAre('x','x','x').length > 0;
    const oWon = linesThatAre('o','o','o').length > 0;
    if(xWon)
    {
      setWinner('x');
      return;
    } 
    else if(oWon)
    {
      setWinner('o');
      return;
    } 


    const computerMoveAt = (index) => {
      let newMarks = marks;
      newMarks[index] = 'o';
      setMarks([...newMarks]);
    };

    const computerResponse = (responseArray) => {
      let moveIndex = responseArray[0].find(index => marks[index] === null);
      computerMoveAt(moveIndex);
    }
    const computerMoves = async () => {
      await delay(500);
      const computerToWinIndexes = linesThatAre('o','o',null);
      if(computerToWinIndexes.length>0) 
      {
        computerResponse(computerToWinIndexes);
        return;
      }
      const computerToBlockIndexes = linesThatAre('x','x',null);
      if(computerToBlockIndexes.length>0) 
      {
        computerResponse(computerToBlockIndexes);
        return;
      }
      const computerToAdvanceIndexes = linesThatAre('o',null,null);
      if(computerToAdvanceIndexes.length>0) 
      {
        computerResponse(computerToAdvanceIndexes);
        return;
      }
      const computerRandomMoveIndexes = emptyIndexes[Math.ceil(Math.random()*emptyIndexes.length)];
      computerMoveAt(computerRandomMoveIndexes);
      
    }
    
    if(isComputerTurn && gameMode===1 && winner==="") computerMoves();

  },[winner,marks,gameMode])


  

  return(
    <main>
      <div className='headerContainer'>
        <h1 className='header'>XOX GAME</h1>
      </div>
      <Table>
        {marks.map((squareMark,index) =>
          <Square 
            mark={squareMark}
            canbemarked={winner===""&&gameMode!==0}
            playerturn={gameMode===1?'':(turn)}
            onClick={() => handleSquareClick(index)}
          />
        )}
      </Table>
      <div className='result'>
        {!!winner && winner === 'x' && (
          <div className="resultX">
            {gameMode===1?"YOU":"Player 1 is"} WON!
          </div>
        )}
        {!!winner && winner === 'o' && (
          <div className="resultO">
            {gameMode===1?"YOU LOST!":"Player 2 is WON!"}
          </div>
        )}
        {marks.filter(value => value === null).length === 0 && !winner && (
        <div className='resultTie'>
          TIE!
        </div>
        )}
      </div>
      
      
      {gameMode===0 && (
        <div className="gameModeButtons">
          <button className='gameModeBtn' onClick={() => {setGameMode(1)}}>SinglePlayer</button>
          <button className='gameModeBtn' onClick={() => {setGameMode(2)}}>Multiplayer</button>
        </div>
      )
      }
    </main>
  )
  
}

export default App;
