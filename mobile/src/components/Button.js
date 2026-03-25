import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Button = ({ 
  onPress, 
  title, 
  loading = false, 
  disabled = false, 
  variant = 'primary', // 'primary', 'secondary', 'outline'
  icon,
  style,
  textStyle
}) => {
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';

  const containerStyle = [
    styles.button,
    isSecondary && styles.secondaryButton,
    isOutline && styles.outlineButton,
    (disabled || loading) && styles.disabled,
    style
  ];

  const content = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator color={isOutline ? '#3498db' : '#fff'} size="small" />
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[
            styles.text, 
            isSecondary && styles.secondaryText,
            isOutline && styles.outlineText,
            textStyle
          ]}>
            {title}
          </Text>
        </>
      )}
    </View>
  );

  if (variant === 'primary' && !disabled && !loading) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={style}>
        <LinearGradient
          colors={['#3498db', '#2980b9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled || loading} 
      activeOpacity={0.7}
      style={containerStyle}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: '#ecf0f1',
    elevation: 1,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3498db',
    elevation: 0,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryText: {
    color: '#2c3e50',
  },
  outlineText: {
    color: '#3498db',
  },
  iconContainer: {
    marginRight: 8,
  }
});

export default Button;
