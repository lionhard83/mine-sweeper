import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Cell, CellProps } from './components/Cell/Cell';

const columnSize = 20;
const rowSize = 20;
const probabilityToGenerateBomb = 0.3;



const generateNear = (column: number, row: number): {row: number, column: number}[] => {
  let result: {row: number, column: number}[] = [];
  result.push({column: column -1, row: row -1});
  result.push({column: column,    row: row -1});
  result.push({column: column + 1, row: row -1});
  result.push({column: column - 1, row: row + 1});
  result.push({column: column - 1, row: row});
  result.push({column: column, row: row + 1});
  result.push({column: column + 1, row: row + 1});
  result.push({column: column + 1, row: row});
  return result.filter(({row, column}) => row >= 0 && column >= 0 && row < rowSize && column < columnSize)
}

const generateValue = (grid: CellProps[][], row: number, column: number): number => {
  const near = generateNear(row, column);
  return near.reduce((acc, cell) => acc+= grid[cell.row][cell.column].isBomb ? 1 : 0 ,0)
}

function App() {
  const generateGrid = () => {
    const grid = Array.from({length: rowSize}, (_, index1) => Array.from({length: columnSize}, (_, index2) => ({
    isBomb:  Math.random() < probabilityToGenerateBomb,
    isShown: false,
    isFlag: false,
    value: 0,
    row: index1,
    column: index2
  })));
  return grid.map((item, index1) => item.map((subitem, index2) => ({...subitem, value: generateValue(grid, index2, index1)})));
};

  const [grid, setGrid] = useState(generateGrid());

  console.log(grid);
  return (
    <div >
      {grid.map((item, index) => <div key={index} className="container">
        {item.map((cell, subIndex) => 
        <Cell key={`${index}-${subIndex}`} {...cell} ></Cell>)}
      </div>)}     
    </div>
  );
}

export default App;
