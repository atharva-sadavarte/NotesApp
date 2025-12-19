import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import api from '../api/axiosInstance';

export default function NoteDetailScreen({ route }) {
  const { id } = route.params;
  const [note, setNote] = useState(null);

  const fetchNote = async () => {
    try {
      const res = await api.get(`/notes/${id}`);
      setNote(res.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load note');
    }
  };

  useEffect(() => {
    fetchNote();
  }, []);

  if (!note) return null;

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
        {note.title}
      </Text>
      <Text style={{ marginTop: 12 }}>
        {note.content}
      </Text>
    </View>
  );
}
