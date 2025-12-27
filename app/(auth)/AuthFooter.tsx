import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function AuthFooter({ type }: { type: 'signin' | 'signup' }) {
  return (
    <View style={styles.container}>
      {type === 'signin' ? (
        <Text style={styles.text}>New caregiver? <Link href="/(auth)/sign-up" style={styles.link}>Create Account</Link></Text>
      ) : (
        <Text style={styles.text}>Already have an account? <Link href="/(auth)/sign-in" style={styles.link}>Sign In</Link></Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 24, alignItems: 'center' },
  text: { color: '#94A3B8', fontSize: 14 },
  link: { color: '#4FD1C7', fontWeight: '700' }
});