import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#FF7F50', // coral
  background: '#FFF8F0',
  inputBorder: '#FFDAB9',
  text: '#333',
  error: '#FF4D4D',
  link: '#FF7F50',
};

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  input: {
    height: 48,
    borderColor: COLORS.inputBorder,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  link: {
    marginTop: 16,
    color: COLORS.link,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 8,
    textAlign: 'center',
  },
});
