import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

const HEADER_HEIGHT = 56; // standard material header height

export default function Header({
  title,
  showBackButton = false,
  rightIcons = [],
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      {/* Status Bar */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={false}
      />

      {/* Header */}
      <View style={styles.header}>
        {showBackButton ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconButton} />
        )}

        <Text style={styles.title}>{title}</Text>

        <View style={styles.rightIconsContainer}>
          {rightIcons.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              style={styles.iconButton}
            >
              <item.icon size={22} color={item.color || '#000'} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Platform.OS === 'android'
      ? 30 + (StatusBar.currentHeight || 0)  // Android: header + status bar
      : 56,                                   // iOS: header height (status handled by SafeArea)
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 8,
    color: '#000',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
