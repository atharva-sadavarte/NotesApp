// jest-setup.js
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage for Jest
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
