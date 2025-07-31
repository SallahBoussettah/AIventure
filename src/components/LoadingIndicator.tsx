import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants';

interface LoadingIndicatorProps {
  text: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  text: {
    marginTop: 16,
    fontSize: 18,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },
});

export default LoadingIndicator;