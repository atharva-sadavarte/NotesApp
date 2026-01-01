import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Clipboard,
  Platform,
} from 'react-native';
import { Copy, Share2, Edit, Trash2 } from 'lucide-react-native';
import api from '@api/axiosInstance';
import Header from '@components/Header';
import CreateNoteModal from '@components/CreateNoteModal';
import { deleteNote, updateNote } from '@api/notes.api';

export default function NoteDetailScreen({ route, navigation }) {
  const { id, noteColors } = route.params || {};
  const [note, setNote] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fallback colors
  const colors = noteColors || {
    background: '#FFFFFF',
    border: '#F0F0F0',
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
    hours = hours % 12 || 12;
    return `${day}/${month}/${year}, ${hours}:${minutes}${ampm}`;
  };

  const fetchNote = async () => {
    try {
      const res = await api.get(`/notes/${id}`);
      setNote(res.data);
    } catch {
      Alert.alert('Error', 'Failed to load note');
    }
  };

  useEffect(() => {
    fetchNote();
  }, []);

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteNote(id);
              navigation.goBack();
            } catch (error) {
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to delete note'
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleUpdate = async ({ title, content }) => {
    try {
      setLoading(true);
      await updateNote(note.id, { title, content });
      fetchNote();
      setEditVisible(false);
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update note'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!note) return;
    const text = `Title: ${note.title}\n\n${note.content}`;
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(text);
      Alert.alert('Copied', 'Note copied to clipboard!');
    } else {
      Clipboard.setString(text);
      Alert.alert('Copied', 'Note copied to clipboard!');
    }
  };

  const handleShare = async () => {
    if (!note) return;
    try {
      await Share.share({
        message: `Title: ${note.title}\n\n${note.content}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share note');
    }
  };

  if (!note) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        title="Details"
        showBackButton
        rightIcons={[
          { icon: Copy, onPress: handleCopy, color: '#4F46E5' },
          { icon: Share2, onPress: handleShare, color: '#0284C7' },
          { icon: Edit, onPress: () => setEditVisible(true), color: '#6366F1' },
          { icon: Trash2, onPress: handleDelete, color: '#EF4444' },
        ]}
      />

      {/* Content */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{note.title}</Text>
        </View>

        <View
          style={[
            styles.contentContainer,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Text style={styles.contentText}>{note.content || 'No content'}</Text>
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDateTime(note.created_at)}</Text>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <CreateNoteModal
        visible={editVisible}
        mode="edit"
        initialTitle={note.title}
        initialContent={note.content}
        loading={loading}
        onClose={() => setEditVisible(false)}
        onSubmit={handleUpdate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  contentScroll: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
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
    lineHeight: 36,
  },
  contentContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#374151',
  },
  dateContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  dateText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});
