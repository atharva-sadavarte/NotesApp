import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Sparkles } from 'lucide-react-native';
import CustomTextInput from './CustomTextInput.js';
import CustomButton from './CustomButton.js';

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

// Generate random color for new note
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * NOTE_COLORS.length);
  return NOTE_COLORS[randomIndex];
}

export default function CreateNoteModal({ visible, onClose, onCreateNote, loading = false }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  // Clear inputs when modal closes
  useEffect(() => {
    if (!visible) {
      setTitle('');
      setContent('');
      setError('');
    }
  }, [visible]);

  const handleCreate = () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    // Generate random color during creation
    const randomColor = getRandomColor();
    // Store values before clearing
    const noteTitle = title;
    const noteContent = content;
    // Clear inputs instantly
    setTitle('');
    setContent('');
    onCreateNote({ title: noteTitle, content: noteContent, noteColor: randomColor });
  };

  const handleClose = () => {
    // Clear inputs instantly
    setTitle('');
    setContent('');
    setError('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.headerContent}>
              <View style={styles.titleContainer}>
                <View style={styles.iconWrapper}>
                  <Sparkles size={22} color="#6366F1" strokeWidth={2} />
                </View>
                <Text style={styles.modalTitle}>New Note</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton} activeOpacity={0.7}>
              <View style={styles.closeButtonCircle}>
                <X size={18} color="#6B7280" strokeWidth={2.5} />
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <CustomTextInput
              name="Title"
              placeholder="Note Title"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (error) setError('');
              }}
              error={error}
            />

            <CustomTextInput
              name="Content"
              placeholder="Note Content"
              value={content}
              onChangeText={setContent}
              multiline
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <View style={styles.footerButtonContainer}>
              <CustomButton
                name="Cancel"
                onPress={handleClose}
                variant="secondary"
              />
            </View>
            <View style={styles.footerButtonContainer}>
              <CustomButton
                name="Create Note"
                onPress={handleCreate}
                loading={loading}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '92%',
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
  },
  headerContent: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.6,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  modalBody: {
    padding: 28,
    maxHeight: 480,
    backgroundColor: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 28,
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
  },
  footerButtonContainer: {
    flex: 1,
  },
});

