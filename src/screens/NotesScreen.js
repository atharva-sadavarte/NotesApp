import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { fetchNotes, createNote } from "../api/notes.api.js";
import useAuthStore from "../store/authStore.js";

export default function NotesScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const loadNotes = async () => {
    try {
      console.log("Fetching notes for user:", user);
      const data = await fetchNotes();
      console.log("Notes fetched:", data);
      setNotes(data);
    } catch (error) {
      console.log("FETCH NOTES ERROR:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to load notes");
    }
  };

  const handleCreateNote = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Title is required");
      return;
    }

    try {
      console.log("Creating note for user:", user);
      const data = await createNote({ title, content });
      console.log("Note created:", data);
      setTitle("");
      setContent("");
      loadNotes();
    } catch (error) {
      console.log("CREATE NOTE ERROR:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create note"
      );
    }
  };

  useEffect(() => {
    if (!user) {
      console.log("No user found in store. You might not be logged in yet.");
    } else {
      loadNotes();
    }
  }, [user]);

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ marginBottom: 4 }}>
        Welcome, {user?.email || "Guest"}
      </Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
      />

      <TextInput
        placeholder="Content"
        value={content}
        onChangeText={setContent}
        style={{ borderWidth: 1, marginBottom: 8, padding: 8 }}
        multiline
      />

      <Button title="Create Note" onPress={handleCreateNote} />

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("NoteDetail", { id: item.id })
            }
          >
            <Text style={{ fontSize: 16, marginBottom: 8 }}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
