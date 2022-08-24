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

const defaultWinner = "";
const defaultGameMode = 0;
const defaultTurn = 'x';
const defaultMarker = '';

function App() {
  const [marks, setMarks] = useState(defaultMarks());
  const [winner, setWinner] = useState(defaultWinner);
  const [gameMode, setGameMode] = useState(defaultGameMode);
  const [turn, setTurn] = useState(defaultTurn);
  const [marker, setMarker] = useState(defaultMarker);

  
  
  
  const delay = ms => new Promise(res => setTimeout(res, ms));
  
  const moveOfThePlayer = (index,letter) => {
    let newMarks = marks;
    if(newMarks[index]!==null) return;
    newMarks[index] = letter;
    setMarks([...newMarks]);
  }

  

  useEffect(() => {
    if(marks.filter(mark => mark === null).length === 0) return;
    
    const isFirstPlayerTurn = marks.filter(mark => mark !== null).length % 2 === 0;
    if(isFirstPlayerTurn)
    {
      setTurn('x');
      return;
    }
    setTurn('o');
  },[turn,marks])

  function handleSquareClick(index){
    var turnVariable = 1;
    if(marker === 'o') turnVariable = 0;
    if(marks.filter(mark => mark !== null).length % 2 === turnVariable && gameMode === 1) return;
    if(winner !== "" || gameMode===0 || marker === '') return;
    if(marker === 'o'){
      if (turn ==='o') {
        moveOfThePlayer(index,'o');
        return;
      }
      moveOfThePlayer(index,'x');
      return;
    }
    if (turn==='x') {
      moveOfThePlayer(index,'x');
      return;
    }
    moveOfThePlayer(index,'o');
  }

  function handleRestartClick(){
    setMarks(defaultMarks());
    setTurn(defaultTurn);
    setWinner(defaultWinner);
  }

  function handleQuitClick(){
    setMarks(defaultMarks());
    setGameMode(defaultGameMode);
    setTurn(defaultTurn);
    setWinner(defaultWinner);
    setMarker(defaultMarker);
  }
  
  useEffect( ()  => {
    if(marks.filter(mark => mark === null).length === 0 || marker === '') return;
    var turnVariable;
    switch(marker){
      case 'o': turnVariable = 0;
      break;
      default: turnVariable = 1;
      break;
    }
    const isComputerTurn = marks.filter(mark => mark !== null).length % 2 === turnVariable;

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
      if(marker==='o')
      {
        newMarks[index] = 'x';
        setMarks([...newMarks]);
        return;
      } 
      newMarks[index] = 'o';
      setMarks([...newMarks]);
    };

    const computerResponse = (responseArray) => {
      let moveIndex = responseArray[0].find(index => marks[index] === null);
      computerMoveAt(moveIndex);
    }
    const computerMoves = async () => {
      await delay(200);
      var computerMark = 'o';
      var playerMark = 'x';
      if(marker === 'o'){
        computerMark = 'x';
        playerMark = 'o';
      }
      

      const computerToWinIndexes = linesThatAre(computerMark,computerMark,null);
      if(computerToWinIndexes.length>0) 
      {
        computerResponse(computerToWinIndexes);
        return;
      }
      const computerToBlockIndexes = linesThatAre(playerMark,playerMark,null);
      if(computerToBlockIndexes.length>0) 
      {
        computerResponse(computerToBlockIndexes);
        return;
      }
      const computerToAdvanceIndexes = linesThatAre(computerMark,null,null);
      if(computerToAdvanceIndexes.length>0) 
      {
        computerResponse(computerToAdvanceIndexes);
        return;
      }
      if(emptyIndexes.length === 1)
      {
        computerMoveAt(emptyIndexes[0]);
      }
      const computerRandomMoveIndexes = emptyIndexes[Math.ceil(Math.random()*emptyIndexes.length)];
      computerMoveAt(computerRandomMoveIndexes);
      
    }
    
    if(isComputerTurn && gameMode===1 && winner==="") computerMoves();

  },[winner,marks,gameMode,marker])


  

  return(
    <main>
      <div className='headerButtonsContainer'>
        <div className='restartContainer'>
        <button onClick={() => handleRestartClick()} className='restart'>Restart</button>
        </div>
        <div className='quitContainer'>
          <button onClick={() => handleQuitClick()} className='quit'>Quit</button>
        </div>
      </div>
      <div className='headerContainer'>
        <h1 className='header'>XOX GAME</h1>
      </div>
      <Table>
        {marks.map((squareMark,index) =>
          <Square 
            mark={squareMark}
            canbemarked={winner===""&&gameMode!==0&&marker!==''}
            playerturn={turn}
            onClick={() => handleSquareClick(index)}
          />
        )}
      </Table>
      <div className='result'>
        {!!winner && ((winner === 'x' && marker === 'x') || (winner === 'o' && marker === 'o')) && (
          <div className="resultX">
            {gameMode===1?"YOU":"Player 1 is"} WON!
          </div>
        )}
        {!!winner && ((winner === 'o' && marker === 'x') || (winner === 'x' && marker === 'o')) && (
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
      {gameMode!==0 && marker==='' && (
        <div className='gameModeContainer'>
          <h1 className='gameModeHeader'>Player 1 :</h1>
          <div className='gameModeButtons'>
            <button className='gameModeBtn' onClick={() => {setMarker('x')}}>X</button>
            <button className='gameModeBtn' onClick={() => {setMarker('o')}}>O</button>
          </div>
        </div>
        
      )}
      
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
