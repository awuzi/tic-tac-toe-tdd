import { CellState, DrawState, GAME_STATUS, Grid, GRID_DIMENSION, PendingState, PLAYERS, Position, Row, State, WonState } from './types';
import { error, Error, Maybe, success, Success } from './utils/maybe';

export function makeEmptyGrid(
  rows: number
): (cols: number) => Grid {
  return (cols: number): Grid => Array.from(Array(rows), makeColumn(cols));
}

function makeColumn(
  col: number
): () => Row {
  return (): Row => Array(col).fill('_');
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
  if (checkDraw(grid)) {
    return GAME_STATUS.DRAW;
  }

  if (checkWin(grid, token)) {
    return GAME_STATUS.WON;
  }

  return GAME_STATUS.PENDING;
};

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
  { x, y }: Position,
  grid: Grid
): Maybe<Grid> {
  const mutabledGrid = grid.map(
    (row, rowIndex) => row.map(
      (cell, cellIndex) => cell
    )
  );

  if (isCellEmpty(mutabledGrid[y][x])) {
    mutabledGrid[y][x] = token;
    return success(mutabledGrid);
  }
  return error('Error: cell is not empty !');
}


export function computeNextState<S extends GAME_STATUS>(
  state: State,
  token: PLAYERS,
  position: Position
): Maybe<State> {
  if (state.status === 'PENDING') {
    return makeMove(token, position, state.grid)
      .map(grid => {
        const status: GAME_STATUS = computeGameStatus(grid, token);
        return success(updateState(state, status, grid, token));
      });
  }
  return success(state);
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
