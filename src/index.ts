import { CellState, DrawState, GAME_STATUS, Grid, PendingState, PLAYERS, Position, Row, State, WonState } from './types';
import { error, Maybe, success } from './utils/maybe';

export function makeEmptyGrid(
  nbOfRows: number
): (nbOfCols: number) => Grid {
  return (nbOfCols: number): Grid => Array.from(Array(nbOfRows), makeColumn(nbOfCols));
}

export function isCellEmpty(
  cell: CellState
): cell is '_' {
  return cell === '_';
}

export function getNextPlayer(token: PLAYERS): PLAYERS {
  return token === PLAYERS.X ? PLAYERS.O : PLAYERS.X;
}

export function computeGameStatus(
  grid: Grid,
  token: PLAYERS
): GAME_STATUS {
  if (checkDraw(grid)) return GAME_STATUS.DRAW;
  if (checkWin(grid, token)) return GAME_STATUS.WON;
  return GAME_STATUS.PENDING;
}

export function checkWin(
  grid: Grid,
  token: PLAYERS
): boolean {
  const winningPositions: Position[][] = [
    [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
    [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
    [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
    [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
    [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }],
    [{ x: 0, y: 2 }, { x: 1, y: 1 }, { x: 2, y: 0 }]
  ];

  return !!winningPositions
    .map(readBoard(grid))
    .filter(threeTokensMatch(token)).length;
}

export function readBoard(
  grid: Grid
) {
  return (winningPosition: Position[]): CellState[] => {
    return winningPosition.map(pos => grid[pos.x][pos.y]);
  };
}

export function threeTokensMatch(
  token: PLAYERS
) {
  return (row: Row): boolean => {
    return row.every(cell => cell === token);
  };
}

export function checkDraw(grid: Grid) {
  return !grid.flatMap(c => c).some(isCellEmpty);
}

export function makeMove(
  token: PLAYERS,
  position: Position,
  grid: Grid
): Maybe<Grid> {
  const updatedGrid = grid
    .map((row, rowIndex) => row.map(replaceCell(rowIndex, position, token)));

  return isCellEmpty(grid[position.y][position.x])
    ? success(updatedGrid)
    : error('Error: cell is not empty !');
}

export function computeNextState<S extends GAME_STATUS>(
  state: State,
  token: PLAYERS,
  position: Position
): Maybe<State> {
  return state.status === 'PENDING'
    ? makeMove(token, position, state.grid).map(computeNext(state, token))
    : success(state);
}




function makeColumn(
  nbOfCols: number
): () => Row {
  return (): Row => Array(nbOfCols).fill('_');
}


const replaceCell = (
  rowIndex: number,
  { x, y }: Position,
  token: PLAYERS
): (cell: CellState, index: number) => CellState => {
  return (cell: CellState, index: number) => {
    return (rowIndex === y && index === x) ? token : cell;
  };
};


const computeNext = (
  currentState: State,
  token: PLAYERS
): (grid: Grid) => Maybe<State> => {
  return (grid: Grid): Maybe<State> => {
    const status: GAME_STATUS = computeGameStatus(grid, token);
    return success(updateState(currentState, status, grid, token));
  };
};


function updateState(
  state: State,
  status: GAME_STATUS,
  grid: Grid,
  token: PLAYERS
): State {

  const states: { [T in GAME_STATUS]: State } = {
    [GAME_STATUS.DRAW]: makeDrawState(state, grid),
    [GAME_STATUS.PENDING]: makePendingState(state, grid, token),
    [GAME_STATUS.WON]: makeWonState(state, grid, token)
  };

  return states[status];
}

function makeDrawState(
  state: State,
  grid: Grid
): DrawState {
  return {
    ...state,
    status: GAME_STATUS.DRAW,
    grid
  };
}

function makePendingState(
  state: State,
  grid: Grid,
  token: PLAYERS
): PendingState {
  return {
    ...state,
    grid,
    currentPlayer: getNextPlayer(token),
    status: GAME_STATUS.PENDING
  };
}

function makeWonState(
  state: State,
  grid: Grid,
  winner: PLAYERS
): WonState {
  return {
    ...state,
    grid,
    status: GAME_STATUS.WON,
    winner
  };
}
