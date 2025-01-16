 
 

import {
  BOARD_SIZE,
  getBoardMatrix,
  getCellCenter,
  getClickedCell,
  getPlayerColor,
} from './data.helpers';
import {
  easeInOut,
  fillCircle,
  fillTriangle,
  strokeCircle,
  strokeTriangle,
} from './graphics.helpers';
import type { LudoGameState, Vertex } from './types';
import { CellType, Colors, PlayerId } from './types';

declare global {
  interface Window {
    ludoAnimationStartTime?: number;
  }
}

/**
 * Delays the execution of code by the specified duration.
 * @param ms - The duration of the delay in milliseconds.
 * @returns A Promise that resolves to true after the specified delay.
 */
const sleep = (ms: number) => {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => resolve(true), ms / 1);
  });
};

const renderCoin = (
  context: CanvasRenderingContext2D,
  startCellCenter: Vertex,
  playerType: PlayerId,
  cellSize: number
) => {
  context.shadowColor = Colors.BLACK;
  context.shadowBlur = 10;
  fillCircle(
    startCellCenter,
    cellSize / 2.6,
    getPlayerColor(playerType),
    context
  );
  strokeCircle(startCellCenter, cellSize / 2.6, 1, Colors.BLACK, context);
  strokeCircle(startCellCenter, cellSize / 3, 1, Colors.BLACK, context);
  strokeCircle(startCellCenter, cellSize / 10, 1, Colors.BLACK, context);
  strokeCircle(startCellCenter, cellSize / 20, 1, Colors.BLACK, context);
  context.shadowColor = Colors.TRANSPARENT_LITERAL;
  context.shadowBlur = 0;
};

const renderBoard = async (
  context: CanvasRenderingContext2D,
  boardSize: number,
  gameState: LudoGameState,
  cellSize: number
) => {
  context.fillStyle = Colors.WHITE;
  context.fillRect(0, 0, boardSize, boardSize);
  const { boardMatrix } = gameState;

  // Render the cells, home, and track
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = boardMatrix![i]![j];
       
      if (!cell) continue;

      context.fillStyle = cell.color;
      context.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      context.strokeStyle = Colors.BLACK;
      context.lineWidth = 0.3;
      context.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);

      if (
        cell.type === CellType.START ||
        (cell.type === CellType.SAFE && !cell.player)
      ) {
        const center = {
          x: j * cellSize + cellSize / 2,
          y: i * cellSize + cellSize / 2,
        };
        strokeCircle(center, cellSize / 2.5, 2.5, Colors.BLACK, context);
        strokeCircle(center, cellSize / 3, 1, Colors.BLACK, context);
        strokeCircle(center, cellSize / 3.7, 1, Colors.BLACK, context);
        strokeCircle(center, cellSize / 5, 1, Colors.BLACK, context);
        strokeCircle(center, cellSize / 9, 1, Colors.BLACK, context);
        strokeCircle(center, cellSize / 30, 1, Colors.BLACK, context);
        strokeCircle(center, cellSize / 50, 5, Colors.BLACK, context);
      }
    }
  }

  // Render the finish zone
  const [r1, r2, r3] = [
    { x: cellSize * 6, y: cellSize * 6 },
    { x: cellSize * 6, y: cellSize * 9 },
    { x: cellSize * 7.5, y: cellSize * 7.5 },
  ];
  const [g1, g2, g3] = [
    { x: cellSize * 6, y: cellSize * 6 },
    { x: cellSize * 9, y: cellSize * 6 },
    { x: cellSize * 7.5, y: cellSize * 7.5 },
  ];
  const [b1, b2, b3] = [
    { x: cellSize * 9, y: cellSize * 6 },
    { x: cellSize * 9, y: cellSize * 9 },
    { x: cellSize * 7.5, y: cellSize * 7.5 },
  ];
  const [y1, y2, y3] = [
    { x: cellSize * 6, y: cellSize * 9 },
    { x: cellSize * 9, y: cellSize * 9 },
    { x: cellSize * 7.5, y: cellSize * 7.5 },
  ];
  fillTriangle(r1, r2, r3, getPlayerColor(PlayerId.RED), context);
  fillTriangle(g1, g2, g3, getPlayerColor(PlayerId.GREEN), context);
  fillTriangle(b1, b2, b3, getPlayerColor(PlayerId.YELLOW), context);
  fillTriangle(y1, y2, y3, getPlayerColor(PlayerId.BLUE), context);

  strokeTriangle(r1, r2, r3, 0.3, Colors.BLACK, context);
  strokeTriangle(g1, g2, g3, 0.3, Colors.BLACK, context);
  strokeTriangle(b1, b2, b3, 0.3, Colors.BLACK, context);
  strokeTriangle(y1, y2, y3, 0.3, Colors.BLACK, context);

  // Render the board outline
  context.strokeStyle = Colors.BLACK;
  context.lineWidth = 5;
  context.strokeRect(0, 0, boardSize, boardSize);

  // Render the cells, home, and track
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = boardMatrix![i]![j];
       
      if (!cell) continue;

      cell.coins?.forEach((coin) => {
        const center = getCellCenter(cell, cellSize);
        renderCoin(context, center, coin.player, cellSize);
      });
    }
  }
};

const renderAnimationPath = async (
  context: CanvasRenderingContext2D,
  start: Vertex,
  end: Vertex
) => {
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.lineWidth = 5;
  context.strokeStyle = Colors.BLACK;
  context.stroke();
  context.closePath();

  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.lineWidth = 2;
  context.strokeStyle = 'white';
  context.stroke();
  context.closePath();
};

const animateCoins = async (
  context: CanvasRenderingContext2D,
  animationPath: Vertex[],
  _gameState: LudoGameState,
  cellSize: number,
  _frameCount: number,
  renderPath: boolean,
  animationDuration: number,
  onAnimationComplete: () => void
) => {
  if (animationPath.length < 2) return;
  const start = animationPath[0]!;
  const end = animationPath[1]!;

  if (renderPath) {
    renderAnimationPath(context, start, end);
  }

  if (!window.ludoAnimationStartTime) {
    window.ludoAnimationStartTime = performance.now();
  } else {
    const currentTime = performance.now();
    const timeElapsed = currentTime - window.ludoAnimationStartTime;
    if (timeElapsed > animationDuration) {
      window.ludoAnimationStartTime = undefined;
      onAnimationComplete();
      return;
    }

    const easeOutFactor = easeInOut(timeElapsed / animationDuration);

    const nextPosition = {
      x: start.x + (end.x - start.x) * easeOutFactor,
      y: start.y + (end.y - start.y) * easeOutFactor,
    };
    renderCoin(context, nextPosition, PlayerId.RED, cellSize);
  }
};

const renderLudo = (
  context: CanvasRenderingContext2D,
  gameState: LudoGameState,
  height: number,
  width: number,
  frameCount: number,
  animationPath: Vertex[],
  animationTime: number,
  onAnimationComplete: () => void
) => {
  const side = Math.min(height, width);
  const cellSize: number = side / BOARD_SIZE;
  const boardSize: number = cellSize * BOARD_SIZE;
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';

  // Clear canvas
  renderBoard(context, boardSize, gameState, cellSize);

  if (animationPath.length > 0 && gameState.started) {
    animateCoins(
      context,
      animationPath,
      gameState,
      cellSize,
      frameCount,
      true,
      animationTime,
      onAnimationComplete
    );
  }
};

export {
  BOARD_SIZE,
  getBoardMatrix,
  getCellCenter,
  getClickedCell,
  getPlayerColor,
  renderLudo,
  sleep,
};
