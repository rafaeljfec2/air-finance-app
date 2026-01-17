import React from 'react'
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native'

export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>Air Finance</Text>
      <ActivityIndicator size="large" color="#22c55e" />
      <Text style={styles.loadingText}>Carregando...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18181b',
    zIndex: 1,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 40,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#a1a1aa',
  },
})
