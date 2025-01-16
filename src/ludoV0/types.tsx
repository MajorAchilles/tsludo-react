type Position = {
  row: number;
  col: number;
};

type Coin = {
  id: string;
  player: PlayerId;
  position: Position;
};

type Cell = {
  id: number;
  position: Position;
  type: CellType;
  player?: PlayerId;
  color: string;
  coins: Coin[];
};

type LudoBoardProps = {
  height: number;
  width: number;
  gameState: LudoGameState;
  onUpdateGameState: (state: LudoGameState) => void;
};

type BoardMatrix = Array<Array<Cell>>;

type DiceState = {
  value: number;
  rolling: boolean;
};

 
enum CellType {
  HOME = 'CellType::Home', // Home point for player
  START = 'CellType::Start', // Starting point for player
  SAFE = 'CellType::Safe', // Safe zone for all players
  NORMAL = 'CellType::Normal', // Normal track
  FINISH = 'CellType::Finish', // Finish line for player
  WALL = 'CellType::Wall', // Wall
}

enum PlayerId {
  RED = 'Player::Red',
  BLUE = 'Player::Blue',
  YELLOW = 'Player::Yellow',
  GREEN = 'Player::Green',
}

enum PlayerState {
  NOT_STARTED = 'PlayState::NotStarted',
  ROLLING = 'PlayState::Rolling',
  THINKING = 'PlayState::Thinking',
  MOVING = 'PlayState::Moving',
  FINISHED = 'PlayState::Finished',
  WON = 'PlayState::Won',
  LOST = 'PlayState::Lost',
}

type Player = {
  id: PlayerId;
  state: PlayerState;
  coins: Coin[];
  movesLeft: number;
  nextPossibleStates: PlayerState[];
};

type LudoGameState = {
  currentPlayer: PlayerId;
  players: Player[];
  boardMatrix: BoardMatrix;
  started: boolean;
  diceState: DiceState;
};

enum Colors {
  BLACK = '#000000',
  WHITE = '#ffffff',
  TRANSPARENT_LITERAL = 'transparent',
  RED = '#ff0000',
  BLUE = '#0088ff',
  YELLOW = '#ffff00',
  GREEN = '#00ff00',
}

type Vertex = {
  x: number;
  y: number;
};

type AnimationPath = Array<Vertex>;

export {
  type AnimationPath,
  type BoardMatrix,
  type Cell,
  CellType,
  type Coin,
  Colors,
  type DiceState,
  type LudoBoardProps,
  type LudoGameState,
  type Player,
  PlayerId,
  PlayerState,
  type Vertex,
};
