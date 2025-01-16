import { v4 as uuid } from 'uuid';

import type { BoardMatrix, Cell, Coin, Vertex } from './types';
import { CellType, Colors, PlayerId } from './types';

const BOARD_SIZE = 15;

/**
 * Calculates the center coordinates of a given cell on a game board.
 *
 * @param cell - An object representing a cell on the game board.
 * @param cellSize - The size of each cell on the game board.
 * @returns An object containing the x and y coordinates of the center of the cell.
 */
const getCellCenter = (cell: Cell, cellSize: number): Vertex => {
  const center = {
    x: cell.position.col * cellSize + cellSize / 2,
    y: cell.position.row * cellSize + cellSize / 2,
  };

  return center as Vertex;
};

/**
 * Returns the color associated with a given player type.
 *
 * @param player - An optional value of type `PlayerId` representing the player type. If not provided, the default color 'white' will be returned.
 * @returns A string representing the color associated with the given player type.
 *
 * @example
 * const color = getPlayerColor(PlayerId.RED);
 * console.log(color); // Output: 'red'
 */
const getPlayerColor = (player?: PlayerId): string => {
  switch (player) {
    case PlayerId.RED:
      return Colors.RED;
    case PlayerId.BLUE:
      return Colors.BLUE;
    case PlayerId.YELLOW:
      return Colors.YELLOW;
    case PlayerId.GREEN:
      return Colors.GREEN;
    default:
      return Colors.WHITE;
  }
};

/**
 * Creates instances of the `Coin` type based on the given row and column values.
 *
 * @param row - The row value of the cell.
 * @param col - The column value of the cell.
 * @returns An array of coin instances based on the given row and column values.
 */
const createCoinInstance = (row: number, col: number): Coin[] => {
  const coins: Coin[] = [];
  if (row === 2) {
    if (col === 2 || col === 3) {
      coins.push({ id: uuid(), player: PlayerId.RED, position: { row, col } });
    }

    if (col === 11 || col === 12) {
      coins.push({
        id: uuid(),
        player: PlayerId.GREEN,
        position: { row, col },
      });
    }
  }
  if (row === 3) {
    if (col === 2 || col === 3) {
      coins.push({ id: uuid(), player: PlayerId.RED, position: { row, col } });
    }

    if (col === 11 || col === 12) {
      coins.push({
        id: uuid(),
        player: PlayerId.GREEN,
        position: { row, col },
      });
    }
  }

  if (row === 11) {
    if (col === 2 || col === 3) {
      coins.push({ id: uuid(), player: PlayerId.BLUE, position: { row, col } });
    }

    if (col === 11 || col === 12) {
      coins.push({
        id: uuid(),
        player: PlayerId.YELLOW,
        position: { row, col },
      });
    }
  }
  if (row === 12) {
    if (col === 2 || col === 3) {
      coins.push({ id: uuid(), player: PlayerId.BLUE, position: { row, col } });
    }

    if (col === 11 || col === 12) {
      coins.push({
        id: uuid(),
        player: PlayerId.YELLOW,
        position: { row, col },
      });
    }
  }
  return coins;
};

/**
 * Determines the cell that was clicked on a canvas based on the mouse event, canvas height, and the board matrix.
 * @param event - The mouse event object that contains information about the click event.
 * @param canvasHeight - The height of the canvas element.
 * @param boardMatrix - The matrix representing the game board, where each element is a cell object.
 * @returns The cell object that corresponds to the clicked position on the canvas. If the clicked position is outside the valid range of the board matrix, undefined is returned.
 */
const getClickedCell = (
  event: React.MouseEvent<HTMLCanvasElement, MouseEvent> | Event,
  canvasHeight: number,
  boardMatrix: BoardMatrix
): Cell | undefined => {
  const canvas = event.currentTarget as HTMLCanvasElement;
  const mouseEvent = event as MouseEvent;
  const rect = canvas.getBoundingClientRect();
  const x = mouseEvent.clientX - rect.left;
  const y = mouseEvent.clientY - rect.top;
  // get the cell index
  const cellSize = canvasHeight / BOARD_SIZE;
  const cellRow = Math.floor(y / cellSize);
  const cellCol = Math.floor(x / cellSize);

  if (
    cellRow < 0 ||
    cellRow >= BOARD_SIZE ||
    cellCol < 0 ||
    cellCol >= BOARD_SIZE
  )
    return undefined;

  const cell = boardMatrix![cellRow]![cellCol];
  return cell;
};

/**
 * Generates a matrix representing the game board based on predefined masks for cell types, players, and colors.
 *
 * @returns {Array<Array<Cell>>} The matrix representing the game board, where each element is an object with properties for the cell's position, type, color, and coins.
 *
 * @example
 * import { getBoardMatrix } from './boardUtils';
 *
 * const matrix = getBoardMatrix();
 * console.log(matrix);
 * // Output:
 * // [
 * //   [
 * //     { row: 0, col: 0, id: 0, type: 'WALL', color: 'RED', coins: [] },
 * //     ...
 * //   ],
 * //   ...
 * // ]
 */
const getBoardMatrix = (): BoardMatrix => {
  const matrix: BoardMatrix = [];
  // 0 = wall
  // 1 = track
  // 2 = safe
  // 3 = safe + home
  // 4 = safe + finish
  const cellTypeMask: number[][] = [
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 2, 3, 0, 0, 0, 0, 0, 0],
    [0, 0, 5, 5, 0, 0, 2, 2, 1, 0, 0, 5, 5, 0, 0],
    [0, 0, 5, 5, 0, 0, 1, 2, 1, 0, 0, 5, 5, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0],
    [1, 3, 1, 1, 1, 1, 0, 4, 0, 1, 1, 1, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 4, 0, 4, 2, 2, 2, 2, 2, 1],
    [1, 1, 2, 1, 1, 1, 0, 4, 0, 1, 1, 1, 1, 3, 1],
    [0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 5, 5, 0, 0, 1, 2, 1, 0, 0, 5, 5, 0, 0],
    [0, 0, 5, 5, 0, 0, 1, 2, 3, 0, 0, 5, 5, 0, 0],
    [0, 0, 0, 0, 0, 0, 3, 2, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  ];

  // 0 = no player
  // 1 = red
  // 2 = green
  // 3 = yellow
  // 4 = blue
  const playerMask: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 3, 3, 3, 3, 3, 3, 0],
    [0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 3, 0],
    [0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const colorMask: number[][] = [
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 2, 2, 2, 2, 2, 2],
    [1, 0, 0, 0, 0, 1, 0, 2, 2, 2, 0, 0, 0, 0, 2],
    [1, 0, 1, 1, 0, 1, 0, 2, 0, 2, 0, 2, 2, 0, 2],
    [1, 0, 1, 1, 0, 1, 0, 2, 0, 2, 0, 2, 2, 0, 2],
    [1, 0, 0, 0, 0, 1, 0, 2, 0, 2, 0, 0, 0, 0, 2],
    [1, 1, 1, 1, 1, 1, 0, 2, 0, 2, 2, 2, 2, 2, 2],
    [0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 3, 3, 3, 3, 3, 3, 0],
    [0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 3, 0],
    [4, 4, 4, 4, 4, 4, 0, 4, 0, 3, 3, 3, 3, 3, 3],
    [4, 0, 0, 0, 0, 4, 0, 4, 0, 3, 0, 0, 0, 0, 3],
    [4, 0, 4, 4, 0, 4, 0, 4, 0, 3, 0, 3, 3, 0, 3],
    [4, 0, 4, 4, 0, 4, 0, 4, 0, 3, 0, 3, 3, 0, 3],
    [4, 0, 0, 0, 0, 4, 4, 4, 0, 3, 0, 0, 0, 0, 3],
    [4, 4, 4, 4, 4, 4, 0, 0, 0, 3, 3, 3, 3, 3, 3],
  ];

  for (let i = 0; i < BOARD_SIZE; i++) {
    const row = [] as Array<Cell>;
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cellType = cellTypeMask[i]![j];
      const player = playerMask[i]![j];
      const color = colorMask[i]![j];

      const cell: Cell = {
        id: i * BOARD_SIZE + j,
        position: { row: i, col: j },
        type: CellType.WALL,
        color: getPlayerColor(),
        coins: createCoinInstance(i, j),
      };

      switch (cellType) {
        case 1:
          cell.type = CellType.NORMAL;
          break;
        case 2:
          cell.type = CellType.SAFE;
          break;
        case 3:
          cell.type = CellType.START;
          break;
        case 4:
          cell.type = CellType.FINISH;
          break;
        case 5:
          cell.type = CellType.HOME;
          break;
        default:
          cell.type = CellType.WALL;
          break;
      }

       
      switch (player) {
        case 1:
          cell.player = PlayerId.RED;
          break;
        case 2:
          cell.player = PlayerId.GREEN;
          break;
        case 3:
          cell.player = PlayerId.YELLOW;
          break;
        case 4:
          cell.player = PlayerId.BLUE;
          break;
      }

       
      switch (color) {
        case 1:
          cell.color = getPlayerColor(PlayerId.RED);
          break;
        case 2:
          cell.color = getPlayerColor(PlayerId.GREEN);
          break;
        case 3:
          cell.color = getPlayerColor(PlayerId.YELLOW);
          break;
        case 4:
          cell.color = getPlayerColor(PlayerId.BLUE);
          break;
        default:
          cell.color = getPlayerColor();
          break;
      }

      row.push(cell);
    }
    matrix.push(row);
  }

  return matrix;
};

export {
  BOARD_SIZE,
  createCoinInstance,
  getBoardMatrix,
  getCellCenter,
  getClickedCell,
  getPlayerColor,
};
