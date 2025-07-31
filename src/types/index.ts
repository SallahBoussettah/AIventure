export type GameStatus = 'start' | 'playing' | 'loading' | 'error';

export interface Scene {
  description: string;
  choices: string[];
}

export interface GameState {
  status: GameStatus;
  scene: Scene | null;
  imageUrl: string | null;
  error: string | null;
}

export interface GameContextType {
  gameState: GameState;
  startGame: (theme: string) => Promise<void>;
  makeChoice: (choice: string) => Promise<void>;
  resetGame: () => void;
}