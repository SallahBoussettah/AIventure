import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameState, GameContextType, Scene } from '../types';
import { createAdventureChat, generateImage } from '../services/geminiService';
import { DEFAULT_THEME } from '../constants';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    status: 'start',
    scene: null,
    imageUrl: null,
    error: null,
  });

  const [adventureChat, setAdventureChat] = useState<any>(null);

  const startGame = async (theme: string) => {
    setGameState({
      status: 'loading',
      scene: null,
      imageUrl: null,
      error: null,
    });

    try {
      console.log('Starting game with theme:', theme);
      const chat = createAdventureChat();
      setAdventureChat(chat);
      
      const initialPrompt = `Create an opening scene for a text adventure game. Theme: "${theme || DEFAULT_THEME}". Describe the starting location and situation.`;
      console.log('Sending initial prompt:', initialPrompt);
      
      const scene = await chat.sendMessage(initialPrompt);
      console.log('Received scene:', scene);

      if (scene) {
        // Start image generation but don't wait for it
        generateImage(scene.description).then(imageUrl => {
          if (imageUrl) {
            setGameState(prev => ({
              ...prev,
              imageUrl,
            }));
          }
        }).catch(err => {
          console.log('Image generation failed:', err);
          // Don't fail the whole game for image issues
        });

        setGameState({
          status: 'playing',
          scene,
          imageUrl: null,
          error: null,
        });
      } else {
        throw new Error('Failed to generate opening scene');
      }
    } catch (error) {
      console.error('Error starting game:', error);
      setGameState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }));
    }
  };

  const makeChoice = async (choice: string) => {
    if (!adventureChat) return;

    setGameState(prev => ({ ...prev, status: 'loading', error: null }));

    try {
      console.log('Making choice:', choice);
      const choicePrompt = `The player chose: "${choice}". Continue the story and describe what happens next.`;
      const scene = await adventureChat.sendMessage(choicePrompt);
      console.log('Received new scene:', scene);

      if (scene) {
        // Start image generation but don't wait for it
        generateImage(scene.description).then(imageUrl => {
          if (imageUrl) {
            setGameState(prev => ({
              ...prev,
              imageUrl,
            }));
          }
        }).catch(err => {
          console.log('Image generation failed:', err);
          // Don't fail the whole game for image issues
        });

        setGameState(prev => ({
          ...prev,
          status: 'playing',
          scene,
          error: null,
        }));
      } else {
        throw new Error('Failed to generate next scene');
      }
    } catch (error) {
      console.error('Error making choice:', error);
      setGameState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      status: 'start',
      scene: null,
      imageUrl: null,
      error: null,
    });
    setAdventureChat(null);
  };

  return (
    <GameContext.Provider value={{ gameState, startGame, makeChoice, resetGame }}>
      {children}
    </GameContext.Provider>
  );
};