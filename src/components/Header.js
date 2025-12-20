import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Menu, LogOut } from 'lucide-react-native';

export default function Header({ title, showBackButton = false, showMenu = false, showLogout = false, onMenuPress, onLogoutPress }) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {showLogout && (
        <TouchableOpacity onPress={onLogoutPress} style={styles.iconButton}>
          <LogOut size={24} color="#000" />
        </TouchableOpacity>
      )}
      {showMenu && !showLogout && (
        <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
          <Menu size={24} color="#000" />
        </TouchableOpacity>
      )}
      {!showMenu && !showLogout && showBackButton && <View style={styles.iconButton} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',
    color: '#000',
    marginLeft: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

