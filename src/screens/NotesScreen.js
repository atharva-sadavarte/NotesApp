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
import { Plus, ChevronRight } from "lucide-react-native";
import { fetchNotes, createNote } from "../api/notes.api.js";
import useAuthStore from "../store/authStore.js";
import Header from "../components/Header.js";
import CreateNoteModal from "../components/CreateNoteModal.js";
import NoteColors from "../utils/NoteColors.js";



// Deterministically pick a color based on note id
function getNoteColors(id) {
  const numericId = typeof id === "number" ? id : parseInt(String(id), 10) || 0;
  const index = Math.abs(numericId) % NoteColors.length;
  return NoteColors[index];
}

export default function NotesScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [noteColorsMap, setNoteColorsMap] = useState({});

  const user = useAuthStore((state) => state.user);

  const loadNotes = async () => {
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load notes");
    }
  };

  const handleCreateNote = async ({ title, content, noteColor }) => {
    setIsCreating(true);
    try {
      const data = await createNote({ title, content });

      // Store random color
      if (data && data.id && noteColor) {
        setNoteColorsMap((prev) => ({
          ...prev,
          [data.id]: noteColor,
        }));
      }

      setModalVisible(false);
      loadNotes();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create note"
      );
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if (user) loadNotes();
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      if (user) loadNotes();
    }, [user])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Notes" />
      <View style={styles.content}>
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const colors = noteColorsMap[item.id] || getNoteColors(item.id);
            return (
              <TouchableOpacity
                style={[
                  styles.noteItem,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
                onPress={() =>
                  navigation.navigate("NoteDetail", { id: item.id, noteColors: colors })
                }
                activeOpacity={0.8}
              >
                <View style={styles.noteContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.noteTitle}>{item.title}</Text>
                    {item.content && (
                      <Text style={styles.notePreview} numberOfLines={2}>
                        {item.content}
                      </Text>
                    )}
                  </View>
                  <ChevronRight size={24} color="#6B7280" strokeWidth={2.2} />
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No notes yet. Create your first note!</Text>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* FAB */}
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
        onSubmit={handleCreateNote} // <-- Corrected here
        loading={isCreating}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { flex: 1, padding: 20 },
  noteItem: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  noteContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  noteTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 4,
    color: "#1F2937",
  },
  notePreview: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 60,
    fontSize: 15,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 80,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },
});
