import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { getCellCenter, getClickedCell, renderLudo } from './ludoRenderer';
import type { AnimationPath, LudoBoardProps } from './types';

const LudoBoard = ({
  height,
  width,
  gameState,
  onUpdateGameState,
}: LudoBoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [frameCount, setFrameCount] = useState<number>(0);
  const [isSelectingPath, setIsSelectingPath] = useState<boolean>(false);

  const [animationPath, setAnimationPath] = useState<AnimationPath>([]);

  const handleClick = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent> | Event
  ) => {
    // Get the location of click with respect to the canvas element
    const cell = getClickedCell(event, height, gameState.boardMatrix);
    if (cell) {
      if (!isSelectingPath) {
        setAnimationPath([getCellCenter(cell, height)]);
      } else {
        setAnimationPath([...animationPath, getCellCenter(cell, height)]);
      }
      if (event.type === 'click') {
        setIsSelectingPath(true);
      }
    }

    if (event.type === 'contextmenu') {
      event.preventDefault();
      setIsSelectingPath(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('contextmenu', handleClick);
      const ctx = canvas.getContext('2d');
      if (ctx) {
        setContext(ctx);
      }
    }

    return () => {
      canvas?.removeEventListener('contextmenu', handleClick);
    };
  }, [canvasRef]);

  useLayoutEffect(() => {
    if (!gameState.started)
      return () => {
        window.cancelAnimationFrame(0);
      };

    let frameId: number;

    const animateCallBack = () => {
      setFrameCount((curFrameCount) => curFrameCount + 1);
      frameId = window.requestAnimationFrame(animateCallBack);
    };
    frameId = window.requestAnimationFrame(animateCallBack);

    return () => {
      window.cancelAnimationFrame(frameId);
      setFrameCount(0);
    };
  }, [gameState]);

  useEffect(() => {
    if (!context) return;

    renderLudo(
      context,
      gameState,
      height,
      width,
      frameCount,
      animationPath.length > 1 ? animationPath : [],
      500,
      () => {
        onUpdateGameState({
          ...gameState,
          started: false,
        });
      }
    );
  }, [gameState, frameCount, context]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        height={`${height}px`}
        width={`${width}px`}
        onClick={handleClick}
      />
      <button
        onClick={() => {
          onUpdateGameState({
            ...gameState,
            started: true,
          });
        }}
      >
        {gameState.started ? 'Stop' : 'Start'} Animation
      </button>
    </div>
  );
};

export default LudoBoard;
