import './App.css';
import Table from './Table';
import Square from './Square';
import {useState} from "react";

const defaultMarks = () => (new Array(9)).fill(null);

function App() {
  const [marks, setMarks] = useState(defaultMarks());

  function handleSquareClick(index){
    const isPlayerTurn = marks.filter(mark => mark !== null).length % 2 === 0;
    if (isPlayerTurn) {
      let newMarks = marks;
      newMarks[index] = 'x';
      setMarks([...newMarks]);
    }
  }

  return(
    <main>
      <Table>
        {marks.map((mark,index) =>
          <Square 
            mark={mark}
            onClick={() => handleSquareClick(index)}
          />
        )}
      </Table>
    </main>
  )
  
}

export default App;
