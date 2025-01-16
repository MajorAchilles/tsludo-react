import classnames from 'classnames';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { getRandomDiceValue, renderDice } from './diceRenderer';
import { getPlayerState } from './gameState.helpers';
import type { LudoGameState } from './types';
import { PlayerId, PlayerState } from './types';

type PlayersPanelProps = {
  gameState: LudoGameState;
  height: number;
  width: number;
  onUpdateDiceValue: (diceValue: number) => void;
  onCompleteRollAnimation: () => void;
};

const getPlayerStateIcon = (playerId: PlayerId, gameState: LudoGameState) => {
  const playerState = getPlayerState(playerId, gameState.players);

  switch (playerState) {
    case PlayerState.NOT_STARTED:
      return '⌚';
    case PlayerState.ROLLING:
      return '🎲';
    case PlayerState.THINKING:
      return '🤔';
    case PlayerState.MOVING:
      return '🚶';
    case PlayerState.FINISHED:
      return '🏁';
    case PlayerState.WON:
      return '🏆';
    case PlayerState.LOST:
      return '👎';
    default:
      return '🤷';
  }
};

const PlayersPanel: React.FC<PlayersPanelProps> = ({
  gameState,
  height,
  width,
  onUpdateDiceValue,
  onCompleteRollAnimation,
}: PlayersPanelProps) : React.JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [frameCount, setFrameCount] = useState<number>(0);

  const handleClick = () => {
    onUpdateDiceValue(getRandomDiceValue());
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        setContext(ctx);
      }
    }
  }, [canvasRef]);

  useLayoutEffect(() => {
    if (!gameState.diceState.rolling) {
      return () => {
        window.cancelAnimationFrame(0);
        setFrameCount(0);
      };
    }

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

    renderDice(
      context,
      gameState.diceState,
      height,
      width,
      frameCount,
      2000,
      onCompleteRollAnimation
    );
  }, [frameCount, context]);

  return (
    // font-extrabold
    <div className="grid grid-cols-2 gap-2 p-5">
      <div
        className={classnames('bg-red-500', {
          'border-4 border-black font-extrabold':
            gameState.currentPlayer === PlayerId.RED,
        })}
      >
        Red {getPlayerStateIcon(PlayerId.RED, gameState)}
      </div>
      <div
        className={classnames('bg-green-500', {
          'border-4 border-black font-extrabold':
            gameState.currentPlayer === PlayerId.GREEN,
        })}
      >
        Green {getPlayerStateIcon(PlayerId.GREEN, gameState)}
      </div>
      <div
        className={classnames('bg-blue-500', {
          'border-4 border-black font-extrabold':
            gameState.currentPlayer === PlayerId.BLUE,
        })}
      >
        Blue {getPlayerStateIcon(PlayerId.BLUE, gameState)}
      </div>
      <div
        className={classnames('bg-yellow-500', {
          'border-4 border-black font-extrabold':
            gameState.currentPlayer === PlayerId.YELLOW,
        })}
      >
        Yellow {getPlayerStateIcon(PlayerId.YELLOW, gameState)}
      </div>

      <canvas
        ref={canvasRef}
        height={`${height}px`}
        width={`${width}px`}
        onClick={handleClick}
      />
    </div>
  );
};

export default PlayersPanel;
