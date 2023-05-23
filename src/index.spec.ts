// @ts-ignore see https://github.com/jest-community/jest-extended#setup
import * as matchers from 'jest-extended';
import {
  checkWin,
  computeGameStatus,
  computeNextState,
  getNextPlayer,
  isCellEmpty,
  makeEmptyGrid,
  makeMove,
  readBoard,
  threeTokensMatch
} from './index';
import { CellState, Grid, PLAYERS, Position, State } from './types';
import { Success, success } from './utils/result';

expect.extend(matchers);

describe('makeEmptyGrid()', () => {
  it('should make 0x0 empty grid', () => {
    const rows = 0;
    const cols = 0;

    const grid = makeEmptyGrid(rows)(cols);

    expect(grid).toEqual([]);
  });

  it('should make 1x1 emtpy grid', () => {
    const E: CellState = '_';
    const rows = 1;
    const cols = 1;

    const grid = makeEmptyGrid(rows)(cols);

    expect(grid).toEqual([[E]]);
  });

  it('should make 2x1 emtpy grid', () => {
    const E: CellState = '_';
    const rows = 2;
    const cols = 1;

    const grid = makeEmptyGrid(rows)(cols);

    expect(grid).toEqual([
      [E],
      [E]
    ]);
  });

  it('should make 3x3 emtpy grid', () => {
    const E: CellState = '_';
    const rows = 3;
    const cols = 3;

    const grid = makeEmptyGrid(rows)(cols);

    expect(grid).toEqual([
      [E, E, E],
      [E, E, E],
      [E, E, E]
    ]);
  });
});

describe('isCellEmpty()', () => {
  it('should return true when cell is empty', () => {
    expect(isCellEmpty('_')).toBe(true);
  })
  ;
  it('should return false when cell is filled', () => {
    expect(isCellEmpty(PLAYERS.O)).toBe(false);
  });
});

describe('makeMove()', () => {
  it('should put a X at the position x=0 and y=0', () => {
    // given
    const grid: Grid = makeEmptyGrid(3)(3);
    const token: PLAYERS = PLAYERS.X;

    // when
    const updatedGrid = makeMove(token, { x: 0, y: 0 }, grid);

    expect(updatedGrid.type).toEqual('SUCCESS');
    // @ts-ignore
    expect(updatedGrid.result).toEqual([
      ['X', '_', '_'],
      ['_', '_', '_'],
      ['_', '_', '_']
    ]);

  });

  it('should put a 0 at the position x=1 and y=1', () => {
    // given
    const grid: Grid = makeEmptyGrid(3)(3);
    const token: PLAYERS = PLAYERS.X;

    // when
    const updatedGrid = makeMove(token, { x: 1, y: 1 }, grid);

    // then
    expect(updatedGrid.type).toEqual('SUCCESS');
    // @ts-ignore
    expect(updatedGrid.result).toEqual([
      ['_', '_', '_'],
      ['_', 'X', '_'],
      ['_', '_', '_']
    ]);
  });

  it('should not put a token in an already filled cell', () => {
    // given
    const grid: Grid = [
      ['_', '_', '_'],
      [PLAYERS.X, '_', '_'],
      ['_', '_', '_']
    ];
    const token: PLAYERS = PLAYERS.O;

    // when
    const updatedGrid = makeMove(token, { x: 0, y: 1 }, grid);

    // then
    expect(updatedGrid.type).toEqual('ERROR');
    // @ts-ignore
    expect(updatedGrid.message).toEqual('Error: cell is not empty !');
  });
});

describe('getNextPlayer()', () => {
  it('should switch player when the current one is X', () => {
    expect(getNextPlayer(PLAYERS.X)).toEqual(PLAYERS.O);
  });
});

describe('readBoard()', () => {
  it('should readBoard and return cell state XX_', () => {
    const winningPosition: Position[] = [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }];

    const grid: Grid = [
      [PLAYERS.X, PLAYERS.X, '_'],
      ['_', PLAYERS.O, '_'],
      ['_', '_', '_']
    ];
    const readGrid = readBoard(grid)(winningPosition);

    expect(readGrid).toEqual(['X', 'X', '_']);
  });

  it('should readBoard and return cell state XXO', () => {
    const winningPosition: Position[] = [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }];

    const grid: Grid = [
      [PLAYERS.X, PLAYERS.X, PLAYERS.O],
      ['_', PLAYERS.O, '_'],
      ['_', '_', '_']
    ];
    const readGrid = readBoard(grid)(winningPosition);

    expect(readGrid).toEqual(['X', 'X', 'O']);
  });
});

describe('threeTokensMatch()', () => {

  it('should matchThreeToken in a row', () => {
    const row = [PLAYERS.X, PLAYERS.X, PLAYERS.X];

    const isMatch = threeTokensMatch(PLAYERS.X)(row);

    expect(isMatch).toBe(true);
  });

  it('should not matchThreeToken in a row', () => {
    const row = [PLAYERS.X, PLAYERS.X, PLAYERS.O];

    const isMatch = threeTokensMatch(PLAYERS.X)(row);

    expect(isMatch).toBe(false);
  });
});

describe('checkWin()', () => {

  it('should win horizontally', () => {
    const grid: Grid = [
      [PLAYERS.X, PLAYERS.X, PLAYERS.X],
      [PLAYERS.O, '_', '_'],
      [PLAYERS.O, '_', '_']
    ];

    const isWin = checkWin(grid, PLAYERS.X);

    expect(isWin).toBe(true);
  });

  it('should win vertically', () => {
    const grid: Grid = [
      [PLAYERS.X, PLAYERS.X, '_'],
      [PLAYERS.O, PLAYERS.X, '_'],
      [PLAYERS.O, PLAYERS.X, PLAYERS.O]
    ];

    const isWin = checkWin(grid, PLAYERS.X);

    expect(isWin).toBe(true);
  });

  it('should win diagonally', () => {

    const grid: Grid = [
      [PLAYERS.X, PLAYERS.O, '_'],
      [PLAYERS.O, PLAYERS.X, '_'],
      [PLAYERS.O, PLAYERS.X, PLAYERS.X]
    ];

    const isWin = checkWin(grid, PLAYERS.X);

    expect(isWin).toEqual(true);
  });

  it('should not win', () => {

    const grid: Grid = [
      [PLAYERS.X, PLAYERS.O, '_'],
      [PLAYERS.O, PLAYERS.X, '_'],
      [PLAYERS.O, PLAYERS.X, PLAYERS.O]
    ];

    const isNotWin = checkWin(grid, PLAYERS.X);

    expect(isNotWin).toEqual(false);
  });
});

describe('getNextPlayer()', function() {
  it('should get next player X', () => {
    expect(getNextPlayer(PLAYERS.O)).toEqual(PLAYERS.X);
  });

  it('should get next player O', () => {
    expect(getNextPlayer(PLAYERS.X)).toEqual(PLAYERS.O);
  });
});

describe('computeGameStatus()', () => {

  it('should return a PENDING state when no player wins', () => {
    const grid: Grid = [
      [PLAYERS.X, PLAYERS.X, PLAYERS.O],
      ['_', PLAYERS.O, '_'],
      ['_', '_', '_']
    ];
    const token = PLAYERS.X;

    expect(computeGameStatus(grid, token)).toEqual('PENDING');
  });

  it('should return a WON state when three tokens are aligned', () => {
    const grid: Grid = [
      [PLAYERS.X, PLAYERS.X, PLAYERS.O],
      [PLAYERS.X, PLAYERS.O, PLAYERS.O],
      [PLAYERS.X, PLAYERS.O, '_']
    ];
    const token = PLAYERS.X;

    expect(computeGameStatus(grid, token)).toEqual('WON');
  });

  it('should return a DRAW state when grid is fullfilled', () => {
    const grid: Grid = [
      [PLAYERS.O, PLAYERS.X, PLAYERS.O],
      [PLAYERS.X, PLAYERS.O, PLAYERS.O],
      [PLAYERS.X, PLAYERS.O, PLAYERS.X]
    ];
    const token = PLAYERS.X;

    expect(computeGameStatus(grid, token)).toEqual('DRAW');
  });
});

describe('computeNextState()', () => {

  it('should compute PENDING state', () => {
    const grid: Grid = [
      [PLAYERS.X, PLAYERS.X, PLAYERS.O],
      ['_', PLAYERS.O, '_'],
      ['_', '_', '_']
    ];
    const newPlayer = PLAYERS.X;
    const oldState: State = {
      grid,
      currentPlayer: PLAYERS.O,
      status: 'PENDING'
    };
    const position: Position = { x: 0, y: 1 };
    const actual = computeNextState(oldState, newPlayer, position)
      .map((s) => success(s.status)) as Success<string>;

    expect(actual.result).toEqual('PENDING');
  });

  it('should compute WON state', () => {
    const grid: Grid = [
      [PLAYERS.X, PLAYERS.X, PLAYERS.O],
      ['_', PLAYERS.O, PLAYERS.X],
      ['_', '_', '_']
    ];
    const newPlayer = PLAYERS.O;
    const oldState: State = {
      grid,
      currentPlayer: PLAYERS.X,
      status: 'PENDING'
    };
    const position: Position = { x: 0, y: 2 };
    const actual = computeNextState(oldState, newPlayer, position)
      .map((s) => success(s.status)) as Success<string>;

    expect(actual.result).toEqual('WON');
  });

  it('should compute DRAW state', () => {
    const grid: Grid = [
      [PLAYERS.X, PLAYERS.X, PLAYERS.O],
      [PLAYERS.O, PLAYERS.O, PLAYERS.X],
      [PLAYERS.X, PLAYERS.X, '_']
    ];
    const newPlayer = PLAYERS.X;
    const oldState: State = {
      grid,
      currentPlayer: PLAYERS.O,
      status: 'PENDING'
    };
    const position: Position = { x: 2, y: 2 };
    const actual = computeNextState(oldState, newPlayer, position)
      .map((s) => success(s.status)) as Success<string>;

    expect(actual.result).toEqual('DRAW');
  });

});
