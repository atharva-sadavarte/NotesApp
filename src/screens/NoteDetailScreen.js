import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Trash2 } from 'lucide-react-native';
import api from '../api/axiosInstance';
import Header from '../components/Header.js';
import { deleteNote } from '../api/notes.api.js';

export default function NoteDetailScreen({ route, navigation }) {
  const { id, noteColors } = route.params || {};
  const [note, setNote] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fallback colors if none were passed from NotesScreen
  const colors = noteColors || {
    background: "#FFFFFF",
    border: "#F0F0F0",
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'No date available';
    
    const date = new Date(dateString);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = `${hours}:${minutes}${ampm}`;
    
    return `${day}/${month}/${year}, ${formattedTime}`;
  };

  const fetchNote = async () => {
    try {
      const res = await api.get(`/notes/${id}`);
      setNote(res.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load note');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteNote(id);
              Alert.alert('Success', 'Note deleted successfully', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              // console.log('DELETE NOTE ERROR:', error.response?.data || error.message);
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to delete note'
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    fetchNote();
  }, []);

  if (!note) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Note Details" showBackButton={true} />
      
      {/* Scrollable Content */}
      <ScrollView
        style={styles.contentScroll}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{note.title}</Text>
        </View>

        <View
          style={[
            styles.contentContainer,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={styles.contentText}>{note.content || 'No content'}</Text>
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDateTime(note.created_at)}</Text>
        </View>
      </ScrollView>

      {/* Floating Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        disabled={isDeleting}
        activeOpacity={0.8}
      >
        <View style={styles.deleteButtonInner}>
          <Trash2 size={22} color="#EF4444" strokeWidth={2} />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentScroll: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  titleContainer: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  contentContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#374151',
    letterSpacing: 0.2,
  },
  dateContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  dateText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  deleteButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  deleteButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FEE2E2',
  },
});
