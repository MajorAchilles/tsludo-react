 
 

import { easeOut, fillCircle } from './graphics.helpers';
import type { DiceState } from './types';
import { Colors } from './types';

declare global {
  interface Window {
    animationStartTime?: number;
    lastDiceValue?: number;
  }
}

// const FRAME_RATE = 60;
// const FRAME_TIME = 1000 / FRAME_RATE;

/**
 * Generates a random number between 1 and 6.
 *
 * @returns {number} The generated random number.
 */
const getRandomDiceValue = () => {
  return Math.floor(Math.random() * 6) + 1;
};

const renderDiceFace = async (
  context: CanvasRenderingContext2D,
  diceValue: number,
  size: number
) => {
  // set canvas to white
  context.fillStyle = Colors.WHITE;
  context.fillRect(0, 0, size, size);
  const padding = size / 10; // 10 % of size
  const actualSize = size - padding * 2;
  const radius = padding * 0.8;
  const center = { x: actualSize / 2 + padding, y: actualSize / 2 + padding };
  const topLeft = { x: padding * 3, y: padding * 3 };
  const left = { x: padding * 3, y: center.y };
  const bottomLeft = { x: padding * 3, y: actualSize - padding };
  const topRight = { x: actualSize - padding, y: padding * 3 };
  const right = { x: actualSize - padding, y: center.y };
  const bottomRight = { x: actualSize - padding, y: actualSize - padding };

  // draw a square border with padding of 20 from all sides
  context.beginPath();
  context.roundRect(padding, padding, actualSize, actualSize, radius);
  context.lineWidth = size / 40;
  context.strokeStyle = Colors.BLACK;
  context.stroke();
  context.closePath();

  // draw the dice face

  if (diceValue === 1) {
    fillCircle(center, radius, Colors.BLACK, context);
  }

  if (diceValue === 2) {
    fillCircle(left, radius, Colors.BLACK, context);
    fillCircle(right, radius, Colors.BLACK, context);
  }

  if (diceValue === 3) {
    fillCircle(left, radius, Colors.BLACK, context);
    fillCircle(center, radius, Colors.BLACK, context);
    fillCircle(right, radius, Colors.BLACK, context);
  }

  if (diceValue === 4) {
    fillCircle(topLeft, radius, Colors.BLACK, context);
    fillCircle(topRight, radius, Colors.BLACK, context);
    fillCircle(bottomLeft, radius, Colors.BLACK, context);
    fillCircle(bottomRight, radius, Colors.BLACK, context);
  }

  if (diceValue === 5) {
    fillCircle(topLeft, radius, Colors.BLACK, context);
    fillCircle(topRight, radius, Colors.BLACK, context);
    fillCircle(center, radius, Colors.BLACK, context);
    fillCircle(bottomLeft, radius, Colors.BLACK, context);
    fillCircle(bottomRight, radius, Colors.BLACK, context);
  }

  if (diceValue === 6) {
    fillCircle(topLeft, radius, Colors.RED, context);
    fillCircle(left, radius, Colors.RED, context);
    fillCircle(bottomLeft, radius, Colors.RED, context);
    fillCircle(topRight, radius, Colors.RED, context);
    fillCircle(right, radius, Colors.RED, context);
    fillCircle(bottomRight, radius, Colors.RED, context);
  }
};

const animateDiceFace = (
  context: CanvasRenderingContext2D,
  diceState: DiceState,
  height: number,
  width: number,
  _frameCount: number,
  animationDuration: number,
  onRollDone: () => void
) => {
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  const side = Math.min(height, width);

  // Deal with animation
  if (diceState.rolling) {
    const lastDiceValue = window.lastDiceValue || diceState.value;
    let isLastFrame = false;
    let skipFrame = false;

    if (!window.animationStartTime) {
      window.animationStartTime = performance.now();
    } else {
      const currentTime = performance.now();
      const timeElapsed = currentTime - window.animationStartTime;

      if (timeElapsed > animationDuration) {
        isLastFrame = true;
      } else {
        skipFrame = Math.random() < easeOut(timeElapsed / animationDuration);
      }
    }

    renderDiceFace(context, lastDiceValue, side);

    if (isLastFrame) {
      console.log('animation done');
      window.animationStartTime = 0;
      window.lastDiceValue = diceState.value;
      onRollDone(); // This stops the dice from rolling from now on and signifies that the roll animation is done.
    } else if (!skipFrame) {
      window.lastDiceValue = getRandomDiceValue();
    }
  } else {
    // Show the dice face
    renderDiceFace(context, diceState.value, side);
  }
};

export { getRandomDiceValue, animateDiceFace as renderDice };
