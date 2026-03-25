import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal, Text } from 'react-native';

const LoadingSpinner = ({ visible = true, overlay = false, message = 'Loading...' }) => {
  const content = (
    <View style={overlay ? styles.overlay : styles.container}>
      <ActivityIndicator size="large" color="#3498db" />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );

  if (overlay) {
    return (
      <Modal transparent visible={visible}>
        {content}
      </Modal>
    );
  }

  if (!visible) return null;

  return content;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#34495e',
    fontWeight: '500',
  },
});

export default LoadingSpinner;
