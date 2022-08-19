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
  const [winner, setWinner] = useState(null);
  var isSinglePlayer = false;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  
  const moveOfThePlayer = (index,letter) => {
    let newMarks = marks;
    newMarks[index] = letter;
    setMarks([...newMarks]);
  }

  function handleSquareClick(index){
    if(winner !== null) return;
    const isFirstPlayerTurn = marks.filter(mark => mark !== null).length % 2 === 0;
    
    if (isFirstPlayerTurn) {
      moveOfThePlayer(index,'x');
      return;
    }
    moveOfThePlayer(index,'o');
  }

  useEffect( ()  => {
    const isGameOver = winner!==null;
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
    if(xWon) setWinner('x');
    else if(oWon) setWinner('o');

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
    
    if(isComputerTurn && !isGameOver && isSinglePlayer) computerMoves();

  },[marks,winner,isSinglePlayer])


  

  return(
    <main>
      <Table>
        {marks.map((squareMark,index) =>
          <Square 
            mark={squareMark}
            onClick={() => handleSquareClick(index)}
          />
        )}
      </Table>
      {!!winner && winner === 'x' && (
        <div className="resultX">
          {isSinglePlayer?"YOU":"Player 1 is"} WON!
        </div>
      )}
      {!!winner && winner === 'o' && (
        <div className="resultO">
          {isSinglePlayer?"YOU LOST!":"Player 2 is WON!"}
        </div>
      )}
      {marks.filter(value => value === null).length === 0 && !winner && (
        <div>
          TIE!
        </div>
      )}
    </main>
  )
  
}

export default App;
