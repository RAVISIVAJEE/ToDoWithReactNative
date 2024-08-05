import React, {useState} from 'react';
import {Modal, View, Text, TextInput, Button, StyleSheet} from 'react-native';

const EditTodoModal = ({visible, todo, onClose, onUpdate, theme = 'light'}) => {
  const [text, setText] = useState(todo?.text || '');

  const handleUpdate = () => {
    if (text.trim()) {
      onUpdate({...todo, text});
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View
        style={[
          styles.modalContainer,
          {
            backgroundColor:
              theme === 'light' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.8)',
          },
        ]}>
        <View
          style={[
            styles.modalContent,
            {backgroundColor: theme === 'light' ? '#fff' : '#333'},
          ]}>
          <Text
            style={[
              styles.modalTitle,
              {color: theme === 'light' ? '#000' : '#fff'},
            ]}>
            Edit Task
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme === 'light' ? '#ccc' : '#555',
                color: theme === 'light' ? '#000' : '#fff',
              },
            ]}
            value={text}
            onChangeText={setText}
            placeholderTextColor={theme === 'light' ? '#888' : '#aaa'}
          />
          <Button
            title="Update"
            onPress={handleUpdate}
            color={theme === 'light' ? '#1DA1F2' : '#1E90FF'}
          />
          <Button
            title="Cancel"
            onPress={onClose}
            color={theme === 'light' ? 'red' : '#ff4d4d'}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default EditTodoModal;
