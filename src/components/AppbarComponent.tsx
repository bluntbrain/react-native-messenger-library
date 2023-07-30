import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

interface AppBarProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  showBackIcon: boolean;
}

export const AppBar: React.FC<AppBarProps> = ({
  title,
  subtitle,
  onBack,
  showBackIcon = true,
}) => {
  return (
    <View style={styles.container}>
      {showBackIcon ? (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Image
            source={require('../assets/images/back-button.png')}
            style={styles.backButton}
          />
        </TouchableOpacity>
      ) : null}
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtiteStyle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 8,
    color: '#000',
  },
  subtiteStyle: {
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 8,
    color: '#000',
  },
  backButton: {
    // padding: 4,
    width: 24,
    height: 24,
  },
});

export default AppBar;
