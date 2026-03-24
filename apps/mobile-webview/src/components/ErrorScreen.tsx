import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

interface ErrorScreenProps {
  readonly onRetry: () => void;
}

// Aplicar SafeArea em todas as edges
const SAFE_AREA_EDGES = ["top", "bottom", "left", "right"] as const;

export function ErrorScreen({ onRetry }: ErrorScreenProps) {
  return (
    <SafeAreaView style={styles.container} edges={SAFE_AREA_EDGES}>
      <StatusBar style="auto" />
      <Text style={styles.emoji}>📡</Text>
      <Text style={styles.title}>Sem Conexão</Text>
      <Text style={styles.message}>
        Não foi possível carregar o conteúdo.{"\n"}
        Verifique sua conexão com a internet.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Tentar Novamente</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
