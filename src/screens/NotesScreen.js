import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Plus } from "lucide-react-native";
import { fetchNotes, createNote } from "../api/notes.api.js";
import useAuthStore from "../store/authStore.js";
import Header from "../components/Header.js";
import CreateNoteModal from "../components/CreateNoteModal.js";

// Trendy minimalist color palette - Warm, Peach, Lavender, Neutral tones
const NOTE_COLORS = [
  { background: "#FFF6E5", border: "#FFE8B6" }, // Soft mango cream
  { background: "#FFF1D6", border: "#FFE8B6" }, // Warm pastel yellow
  { background: "#FFECC8", border: "#FFE8B6" }, // Muted mango
  { background: "#FBE7C6", border: "#FFE8B6" }, // Vanilla cream
  { background: "#FAF3E0", border: "#FBE7C6" }, // Almond white
  { background: "#F9EED7", border: "#FBE7C6" }, // Pale sand
  { background: "#FFEFE6", border: "#FFDCD2" }, // Peach milk
  { background: "#FFDCD2", border: "#FFE3D6" }, // Soft blush
  { background: "#FFE3D6", border: "#FADADD" }, // Warm rose
  { background: "#FADADD", border: "#F6E1E1" }, // Dusty pink
  { background: "#F3F0FF", border: "#ECE9FF" }, // Lavender white
  { background: "#ECE9FF", border: "#E8E6F5" }, // Soft lavender
  { background: "#E8E6F5", border: "#E6E1F0" }, // Grey-lavender
  { background: "#F1ECF8", border: "#E6E1F0" }, // Cloud lavender
  { background: "#F5F5F7", border: "#EFEFF4" }, // Apple system white
  { background: "#EFEFF4", border: "#EDEDED" }, // macOS grey
  { background: "#F0F4EC", border: "#EEF3E8" }, // Sage white
  { background: "#EEF3E8", border: "#E8F1EC" }, // Soft olive cream
];

// Deterministically pick a color based on note id
function getNoteColors(id) {
  const numericId = typeof id === "number" ? id : parseInt(String(id), 10) || 0;
  const index = Math.abs(numericId) % NOTE_COLORS.length;
  return NOTE_COLORS[index];
}

export default function NotesScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [noteColorsMap, setNoteColorsMap] = useState({}); // Store colors by note ID

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

  const handleCreateNote = async ({ title, content, noteColor }) => {
    setIsCreating(true);
    try {
      console.log("Creating note for user:", user);
      const data = await createNote({ title, content });
      console.log("Note created:", data);
      
      // Store the random color for this note
      if (data && data.id && noteColor) {
        setNoteColorsMap(prev => ({
          ...prev,
          [data.id]: noteColor
        }));
      }
      
      setModalVisible(false);
      loadNotes();
    } catch (error) {
      console.log("CREATE NOTE ERROR:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create note"
      );
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if (!user) {
      console.log("No user found in store. You might not be logged in yet.");
    } else {
      loadNotes();
    }
  }, [user]);

  // Reload notes when screen comes into focus (e.g., after deleting a note)
  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        loadNotes();
      }
    }, [user])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Notes" />
      <View style={styles.content}>
       
        <View style={styles.notesListSection}>
          <FlatList
            data={notes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              // Use stored color if available, otherwise fall back to ID-based color
              const colors = noteColorsMap[item.id] || getNoteColors(item.id);
              return (
                <TouchableOpacity
                  style={[
                    styles.noteItem,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() =>
                    navigation.navigate("NoteDetail", {
                      id: item.id,
                      noteColors: colors,
                    })
                  }
                >
                  <Text style={styles.noteTitle}>{item.title}</Text>
                  {item.content && (
                    <Text style={styles.notePreview} numberOfLines={2}>
                      {item.content}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No notes yet. Create your first note!</Text>
            }
          />
        </View>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.9}
      >
        <View style={styles.fabGradient}>
          <Plus size={28} color="#fff" strokeWidth={2.5} />
        </View>
      </TouchableOpacity>

      {/* Create Note Modal */}
      <CreateNoteModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreateNote={handleCreateNote}
        loading={isCreating}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  notesListSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  noteItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  noteTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  notePreview: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 60,
    fontSize: 15,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 80,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
