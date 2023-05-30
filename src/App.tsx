import React, { FC, useCallback, useEffect, useState } from 'react';
import './App.css';
import { Cell, CellProps } from './components/Cell/Cell';

const columnSize = 10;
const rowSize = 10;
const probabilityToGenerateBomb = 0.15;



const generateNear = (row: number, column: number): { row: number, column: number }[] =>  
  [
    { column: column - 1, row: row - 1 },
    { column, row: row - 1 },
    { column: column + 1, row: row - 1 },
    { column: column - 1, row: row + 1 },
    { column: column - 1, row },
    { column, row: row + 1 },
    { column: column + 1, row: row + 1 },
    { column: column + 1, row },
  ].filter(({ row, column }) => row >= 0 && column >= 0 && row < rowSize && column < columnSize)


const generateValue = (grid: CellProps[][], row: number, column: number): number =>
  generateNear(row, column).reduce((acc, cell) => acc += grid[cell.row][cell.column].isBomb ? 1 : 0, 0)

const generateGrid = () => {
  const grid = Array.from({ length: rowSize }, (_, index1) => Array.from({ length: columnSize }, (_, index2) => ({
    isBomb: Math.random() < probabilityToGenerateBomb,
    isShown: false,
    isFlag: false,
    isTrampledBomb: false,
    value: 0,
    row: index1,
    column: index2
  })));
  return grid.map((item, index1) => item.map((subitem, index2) => ({ ...subitem, value: generateValue(grid, index1, index2) })));
};

const App: FC<{}> = () => {
  const [grid, setGrid] = useState(generateGrid());
  const [status, setStatus] = useState<'win' | 'lose' | 'pending'>('pending');

  const reset = useCallback(() => {
    setGrid(generateGrid())
  }, [])

  const showNear = useCallback((row: number, column: number) => {
    generateNear(row, column)
      .filter(item => !grid[item.row][item.column].isShown)
      .forEach(cell => {
        grid[cell.row][cell.column].isShown = true;
        if (grid[cell.row][cell.column].value === 0) {
          showNear(cell.row, cell.column);
        }
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showCell = useCallback((row: number, column: number) => {
    grid[row][column].isShown = true;
    if (grid[row][column].isBomb) {
      grid[row][column].isTrampledBomb = true;
      setStatus('lose');
      showAll();
      return;
    }
    if (grid[row][column].isFlag) {
      grid[row][column].isFlag = false;
    }
    if (!grid[row][column].isBomb && grid[row][column].value === 0) {
      showNear(row, column);
    }
    setGrid([...grid])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleFlag =useCallback((row: number, column: number) => {
    if (!grid[row][column].isShown) {
      grid[row][column].isFlag = !grid[row][column].isFlag;
      setGrid([...grid])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showAll =useCallback(() => {
    grid.forEach(item => item.forEach(cell => cell.isShown = true))
    setGrid([...grid])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    status === 'pending' && 
    grid.every(item => item.every(cell => cell.isShown || (cell.isBomb && cell.isFlag))) && 
    setStatus("win");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid])
  
  return (
    <div >
      <p>{status !== 'pending' && status}</p>
      <button onClick={reset} >Reset</button>
      {grid.map((item, index) => <div key={index} className="container">
        {item.map((cell, subIndex) =>
          <Cell onRightClick={toggleFlag}  onLeftClick={showCell} key={`${index}-${subIndex}`} {...cell} ></Cell>)}
      </div>)}
    </div>
  );
}

export default App;
