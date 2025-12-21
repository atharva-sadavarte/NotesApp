import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

export default function Header({ 
  title, 
  showBackButton = false, 
  rightIcons = [] // Array of { icon: Component, onPress: function, color?: string }
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {showBackButton ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconButton} /> // Empty placeholder
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
    marginLeft: 8,
    color: '#000',
    textAlign: 'left',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
