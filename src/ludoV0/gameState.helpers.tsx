import { getBoardMatrix } from './data.helpers';
import type { Coin, LudoGameState, Player } from './types';
import { PlayerId, PlayerState } from './types';

/**
 * Retrieves the state of a player with the given player ID from the list of players.
 *
 * @param {PlayerId} playerId - The ID of the player whose state is to be retrieved.
 * @param {Player[]} players - The list of players.
 * @returns {PlayerState} - The state of the player with the given player ID.
 */
const getPlayerState = (playerId: PlayerId, players: Player[]): PlayerState => {
  const player = players.find((p) => p.id === playerId)!;
  return player.state!;
};

/**
 * Retrieves the current player from the given Ludo game state.
 *
 * @param {LudoGameState} gameState - The Ludo game state object.
 * @returns {Player} - The current player object.
 */
const getCurrentPlayer = (gameState: LudoGameState): Player => {
  const currentPlayer = gameState.players.find(
    (player) => player.id === gameState.currentPlayer
  );
  return currentPlayer!;
};

/**
 * Retrieves the player object with the specified player ID from the given game state.
 *
 * @param {PlayerId} playerId - The ID of the player to retrieve.
 * @param {LudoGameState} gameState - The current game state.
 * @returns {Player} - The player object with the specified ID.
 */
const getPlayer = (playerId: PlayerId, gameState: LudoGameState): Player => {
  const player = gameState.players.find((p) => p.id === playerId);
  return player!;
};

/**
 * Updates the state of a player in the Ludo game state.
 *
 * @param {PlayerId} playerId - The ID of the player to update.
 * @param {PlayerState} nextState - The next state to set for the player.
 * @param {LudoGameState} gameState - The current game state.
 * @returns {Player[]} - The updated array of players with the player's state updated.
 */
const reducePlayerState = (
  playerId: PlayerId,
  nextState: PlayerState,
  gameState: LudoGameState,
  movesLeft?: number,
  nextPossibleStates?: PlayerState[]
) => {
  return gameState.players.map((player) => {
    if (player.id === playerId) {
      return {
        ...player,
        state: nextState,
        movesLeft: movesLeft ?? player.movesLeft - 1,
        nextPossibleStates: nextPossibleStates ?? player.nextPossibleStates,
      };
    }
    return player;
  });
};

/**
 * Updates the game state after a dice click event.
 *
 * @param {number} nextDiceValue - The value of the next dice roll.
 * @param {LudoGameState} gameState - The current game state.
 * @returns {LudoGameState} - The updated game state after the dice click event.
 */
const reduceDiceClick = (
  nextDiceValue: number,
  gameState: LudoGameState
): LudoGameState => {
  const currentPlayer = getCurrentPlayer(gameState);
  let movesLeft = currentPlayer.movesLeft - 1;
  let { nextPossibleStates } = currentPlayer;

  if (nextDiceValue === 6) {
    movesLeft = 1;
    nextPossibleStates = [PlayerState.THINKING];
  }

  return {
    ...gameState,
    diceState: {
      value: nextDiceValue,
      rolling: true,
    },
    players: reducePlayerState(
      gameState.currentPlayer,
      PlayerState.ROLLING,
      gameState,
      movesLeft,
      nextPossibleStates
    ),
  };
};

/**
 * Reduces the game state after a dice roll is done.
 *
 * @param {LudoGameState} gameState - The current game state.
 * @returns {LudoGameState} - The updated game state after the dice roll is done.
 */
const reduceDiceRollDone = (gameState: LudoGameState): LudoGameState => {
  const currentPlayer = getCurrentPlayer(gameState);
  let movesLeft = currentPlayer.movesLeft - 1;
  let { nextPossibleStates } = currentPlayer;

  if (gameState.diceState.value === 6) {
    movesLeft = 1;
    nextPossibleStates = [PlayerState.MOVING];
  }

  return {
    ...gameState,
    diceState: {
      ...gameState.diceState,
      rolling: false,
    },
    players: reducePlayerState(
      gameState.currentPlayer,
      PlayerState.THINKING,
      gameState,
      movesLeft,
      nextPossibleStates
    ),
  };
};

/**
 * Initializes the game state for a Ludo game.
 * @returns {LudoGameState} The initial game state.
 */
const initiateGameState = (): LudoGameState => {
  const boardMatrix = getBoardMatrix();
  const cellsWithCoins = boardMatrix.flat().filter((cell) => !!cell.coins[0]);

  const createPlayer = (playerId: PlayerId) => {
    const cells = cellsWithCoins.filter(
      (cell) => cell.coins[0]?.player === playerId
    );

    return {
      id: playerId,
      state: PlayerState.NOT_STARTED,
      coins: cells.map((cell) => cell.coins[0] as Coin),
      movesLeft: 3,
      nextPossibleStates: [PlayerState.ROLLING],
    };
  };

  const players = [
    createPlayer(PlayerId.RED),
    createPlayer(PlayerId.GREEN),
    createPlayer(PlayerId.YELLOW),
    createPlayer(PlayerId.BLUE),
  ];

  return {
    currentPlayer: PlayerId.RED,
    started: false,
    boardMatrix,
    players,
    diceState: {
      value: 3,
      rolling: false,
    },
  };
};

export {
  getCurrentPlayer,
  getPlayer,
  getPlayerState,
  initiateGameState,
  reduceDiceClick,
  reduceDiceRollDone,
};
