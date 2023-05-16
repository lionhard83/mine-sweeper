import React from 'react';
import './Cell.css';

export type CellProps = {
    value: number;
    isFlag: boolean;
    isBomb: boolean;
    isShown: boolean;
    row: number;
    column: number;
}

export const Cell = (props: CellProps) => {
  const {value, isFlag, isBomb, isShown, row, column} = props;
  return (
    <div className='cell'>{isShown ? (isBomb ? '💣' : value) : isFlag ? '🚩': ''}</div>
  )
}
