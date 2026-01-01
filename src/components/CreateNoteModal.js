import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { X, Sparkles } from "lucide-react-native";
import CustomTextInput from "@components/CustomTextInput";
import CustomButton from "@components/CustomButton";
import NoteColors from "@utils/NoteColors";

// Generate random color for new note
const getRandomColor = () => {
  const index = Math.floor(Math.random() * NoteColors.length);
  return NoteColors[index];
};

export default function CreateNoteModal({
  visible,
  mode = "create", // "create" | "edit"
  initialTitle = "",
  initialContent = "",
  onSubmit,
  onClose,
  loading = false,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible) {
      setTitle(initialTitle);
      setContent(initialContent);
      setError("");
    }
  }, [visible, initialTitle, initialContent]);

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");

    if (mode === "create") {
      const noteColor = getRandomColor();
      onSubmit({ title, content, noteColor });
    } else {
      onSubmit({ title, content });
    }
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setError("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          {/* ---------- Header ---------- */}
          <View style={styles.modalHeader}>
            <View style={styles.titleContainer}>
              <View style={styles.iconWrapper}>
                <Sparkles size={22} color="#4F46E5" strokeWidth={2} />
              </View>
              <Text style={styles.modalTitle}>
                {mode === "create" ? "New Note" : "Edit Note"}
              </Text>
            </View>

            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <View style={styles.closeButtonCircle}>
                <X size={18} color="#6B7280" strokeWidth={2.5} />
              </View>
            </TouchableOpacity>
          </View>

          {/* ---------- Body ---------- */}
          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
          >
            <CustomTextInput
              label="Title"
              placeholder="Note Title"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (error) setError("");
              }}
              error={error}
            />

            <CustomTextInput
              label="Content"
              placeholder="Note Content"
              value={content}
              onChangeText={setContent}
              multiline
            />
          </ScrollView>

          {/* ---------- Footer ---------- */}
          <View style={styles.modalFooter}>
            <CustomButton
              title="Cancel"
              variant="secondary"
              onPress={handleClose}
              style={styles.button}
              textStyle={styles.secondaryButtonText}
            />

            <CustomButton
              title={mode === "create" ? "Create Note" : "Update Note"}
              onPress={handleSubmit}
              loading={loading}
              style={[styles.button, styles.primaryButton]}
              textStyle={styles.primaryButtonText}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: "92%",
    paddingBottom: Platform.OS === "ios" ? 32 : 20,
    elevation: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FAFAFA",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  modalBody: {
    paddingHorizontal: 28,
    paddingTop: 20,
    maxHeight: 480,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FAFAFA",
    gap: 12,
  },
  button: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#4F46E5",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButtonText: {
    color: "#4F46E5",
    fontSize: 16,
    fontWeight: "700",
  },
});
