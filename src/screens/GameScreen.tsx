import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { useGame } from '../context/GameContext';
import LoadingIndicator from '../components/LoadingIndicator';
import { COLORS, FONTS } from '../constants';

const { width } = Dimensions.get('window');

const GameScreen: React.FC = () => {
  const navigation = useNavigation<GameScreenNavigationProp>();
  const { gameState, makeChoice, resetGame } = useGame();

  const handleChoice = async (choice: string) => {
    await makeChoice(choice);
  };

  const handleNewGame = () => {
    resetGame();
    navigation.navigate('Start');
  };

  const isLoading = gameState.status === 'loading';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AIventure</Text>
        <TouchableOpacity style={styles.newGameButton} onPress={handleNewGame}>
          <Text style={styles.newGameText}>New Adventure</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          {gameState.imageUrl ? (
            <Image
              source={{ uri: gameState.imageUrl }}
              style={styles.image}
              contentFit="cover"
              transition={700}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.imagePlaceholderText}>
                {isLoading ? 'Illustrating the scene...' : 'No image available'}
              </Text>
            </View>
          )}
          {isLoading && gameState.scene && (
            <View style={styles.imageOverlay}>
              <LoadingIndicator text="Advancing the story..." />
            </View>
          )}
        </View>

        {/* Story Section */}
        <View style={styles.storyContainer}>
          {isLoading && !gameState.scene ? (
            <LoadingIndicator text="Generating story..." />
          ) : gameState.error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>An error occurred!</Text>
              <Text style={styles.errorText}>{gameState.error}</Text>
            </View>
          ) : gameState.scene ? (
            <>
              <Text style={styles.storyText}>{gameState.scene.description}</Text>
              
              {/* Choices Section */}
              <View style={styles.choicesContainer}>
                {gameState.scene.choices.map((choice, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.choiceButton, isLoading && styles.choiceButtonDisabled]}
                    onPress={() => handleChoice(choice)}
                    disabled={isLoading}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.choiceText}>{choice}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  newGameButton: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newGameText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: width * 0.6,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyContainer: {
    padding: 24,
    backgroundColor: COLORS.surface + '80',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    minHeight: 150,
  },
  storyText: {
    fontSize: 18,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 28,
    marginBottom: 24,
  },
  choicesContainer: {
    gap: 12,
  },
  choiceButton: {
    backgroundColor: COLORS.surfaceLight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  choiceButtonDisabled: {
    opacity: 0.5,
  },
  choiceText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    textAlign: 'left',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.error,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    textAlign: 'center',
  },
});

export default GameScreen;