// screens/SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, Button, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../styles/common';

const SettingsScreen = () => {
  const [name, setName] = useState('');
  const [email] = useState('user@example.com'); // fixed email
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const toggleSwitch = () => setNotificationsEnabled(previousState => !previousState);

  const onChangeTime = (event, selectedDate) => {
    const currentDate = selectedDate || reminderTime;
    setShowTimePicker(Platform.OS === 'ios');
    setReminderTime(currentDate);
  };

  const handleSave = () => {
    // Save logic (to backend or local storage)
    alert('Profile updated!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, styles.disabledInput]}
        placeholder="Email"
        value={email}
        editable={false}
      />
      <Button title="Save" onPress={handleSave} color={COLORS.primary} />

      <View style={styles.section}>
        <Text style={styles.heading}>Notifications</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Enable Reminders</Text>
          <Switch
            trackColor={{ false: '#ccc', true: COLORS.primary }}
            thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
            onValueChange={toggleSwitch}
            value={notificationsEnabled}
          />
        </View>

        {notificationsEnabled && (
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <Text style={styles.timeText}>Reminder Time: {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>
        )}
        {showTimePicker && (
          <DateTimePicker
            value={reminderTime}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )}
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.background,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
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
  disabledInput: {
    backgroundColor: '#eee',
    color: '#888',
  },
  section: {
    marginTop: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: COLORS.text,
  },
  timeText: {
    fontSize: 16,
    color: COLORS.link,
    textAlign: 'center',
    marginTop: 8,
  },
});
