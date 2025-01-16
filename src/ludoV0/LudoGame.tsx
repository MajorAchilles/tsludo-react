import React, { useState } from 'react';

import {
  initiateGameState,
  reduceDiceClick,
  reduceDiceRollDone,
} from './gameState.helpers';
import LudoBoard from './LudoBoard';
import PlayersPanel from './PlayersPanel';
import type { LudoGameState } from './types';

const LudoGame: React.FC = () : React.JSX.Element => {
  const [gameState, setGameState] = useState<LudoGameState>(
    initiateGameState()
  );

  const onUpdateDiceValue = (diceValue: number) => {
    setGameState((prevState) => {
      return reduceDiceClick(diceValue, prevState);
    });
  };
  const onCompleteRoll = () => {
    setGameState((prevState) => {
      return reduceDiceRollDone(prevState);
    });
  };

  const onUpdate = (newGameState: LudoGameState) => {
    setGameState(newGameState);
  };

  return (
    <>
      <PlayersPanel
        height={150}
        width={150}
        gameState={gameState}
        onUpdateDiceValue={onUpdateDiceValue}
        onCompleteRollAnimation={onCompleteRoll}
      />
      <LudoBoard
        height={750}
        width={750}
        gameState={gameState}
        onUpdateGameState={onUpdate}
      />
    </>
  );
};

export default LudoGame;
