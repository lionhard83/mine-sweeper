import React, {memo} from 'react';
import './Cell.css';

export type CellProps = {
    value: number;
    isFlag: boolean;
    isBomb: boolean;
    isTrampledBomb: boolean;
    isShown: boolean;
    row: number;
    column: number;
}

export const Cell = memo((props: CellProps & {onLeftClick?: Function, onRightClick?: Function}) => {
  const {value, isFlag, isBomb, isTrampledBomb, isShown, row, column, onLeftClick, onRightClick} = props;
  const onContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    onRightClick && onRightClick(row, column)
  }
  return (
    <div onContextMenu={(e) => onContextMenu(e)} onClick={() => onLeftClick && onLeftClick(row, column)} className={`cell ${isShown ? 'isShown' : ''} ${isTrampledBomb ? 'isTrampledBomb' : ''}`}>{isShown ? (isBomb ? '💣' : (value === 0 ? '' : value)) : isFlag ? '🚩': ''}</div>
  )
});
