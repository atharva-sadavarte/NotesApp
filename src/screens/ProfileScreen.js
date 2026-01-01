import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { User, Mail, LogOut } from 'lucide-react-native';
import useAuthStore from '@store/authStore.js';
import Header from '@components/Header.js';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => logout() },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={48} color="#8338EC" /> 
            </View>
          </View>
          <Text style={styles.userName}>{user?.email || 'Guest'}</Text>
        </View>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>User Details</Text>

          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: '#D9D4F1' }]}>
                <Mail size={20} color="#8338EC" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{user?.email || 'Not available'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <View style={[styles.detailIcon, { backgroundColor: '#D9D4F1' }]}>
                <User size={20} color="#8338EC" />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>User ID</Text>
                <Text style={styles.detailValue}>{user?.id || 'Not available'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Soft pastel background
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EDE7FF', // Light pastel background
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#8338EC', // Bold accent
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  detailsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280', // muted grey
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  logoutSection: {
    padding: 16,
    paddingBottom: 32,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE3E3', // Soft red pastel
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
});
