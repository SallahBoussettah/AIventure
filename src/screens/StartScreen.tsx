import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';

type StartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Start'>;
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useGame } from '../context/GameContext';
import LoadingIndicator from '../components/LoadingIndicator';
import { COLORS, FONTS, DEFAULT_THEME } from '../constants';

const StartScreen: React.FC = () => {
  const [theme, setTheme] = useState('');
  const navigation = useNavigation<StartScreenNavigationProp>();
  const { gameState, startGame } = useGame();

  const handleStart = async () => {
    await startGame(theme || DEFAULT_THEME);
  };

  // Navigate to game screen when status changes to 'playing'
  useEffect(() => {
    if (gameState.status === 'playing') {
      navigation.navigate('Game');
    }
  }, [gameState.status, navigation]);

  const isLoading = gameState.status === 'loading';

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingIndicator text="Conjuring your world..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="sparkles" size={64} color={COLORS.primary} />
            <Text style={styles.title}>AIventure</Text>
            <Text style={styles.subtitle}>
              An endless world of text and visuals, powered by AI.
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={theme}
              onChangeText={setTheme}
              placeholder={`e.g., "${DEFAULT_THEME}"`}
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleStart}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.buttonGradient}
              >
                <Ionicons name="play" size={20} color={COLORS.background} />
                <Text style={styles.buttonText}>Begin Your Adventure</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {gameState.error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{gameState.error}</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 48,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    gap: 16,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    minHeight: 80,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.background,
  },
  errorContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: COLORS.error + '20',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },
});

export default StartScreen;