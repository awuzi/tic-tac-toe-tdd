export const GRID_DIMENSION = 3;

export type Position = {
  x: 0 | 1 | 2;
  y: 0 | 1 | 2;
};

export enum PLAYERS {
  X = "X",
  O = "O",
}

export type EmptyCell = "_";
export type CellState = PLAYERS | EmptyCell;

export type Row =  CellState[];
export type Grid = Row[];

export enum GAME_STATUS {
  PENDING = "PENDING",
  WON = "WON",
  DRAW = "DRAW",
}

export type State = DrawState | WonState | PendingState;

type GridState = {
  grid: Grid,
};

export interface DrawState extends GridState {
  status: 'DRAW'
}

export interface WonState extends GridState {
  status: 'WON',
  winner: PLAYERS;
}

export interface PendingState extends GridState {
  status: 'PENDING',
  currentPlayer: PLAYERS;
}

export type NextPlayer<P extends PLAYERS> = P extends 'X' ? 'O' : 'X';
