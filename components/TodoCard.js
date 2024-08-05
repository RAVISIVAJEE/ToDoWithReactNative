import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const TodoCard = ({todo, onComplete, onEdit, onDelete}) => {
  return (
    <View style={styles.card}>
      <Text style={[styles.taskText, todo.completed && styles.completed]}>
        {todo.text}
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.completeButton]}
          onPress={() => onComplete(todo.id)}>
          <Text style={styles.buttonText}>
            {todo.completed ? 'Undo' : 'Complete'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={onEdit}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={onDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  taskText: {
    fontSize: 18,
    color: 'black',
    fontWeight: '500',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#28a745',
  },
  editButton: {
    backgroundColor: '#007bff',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
});

export default TodoCard;
