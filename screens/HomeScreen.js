import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import TodoCard from '../components/TodoCard';
import EditTodoModal from '../components/EditTodoModal';
import {addTask, updateTask, deleteTask, fetchTasks} from '../utils/api';
import {useAuth} from '../AuthContext';

const HomeScreen = ({navigation}) => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const {token, logout} = useAuth();
  console.log('token after using in homescreen', token);
  const loadTasks = async token => {
    try {
      const fetchedTasks = await fetchTasks(token);
      console.log('Fetched tasks:', fetchedTasks);
      if (Array.isArray(fetchedTasks)) {
        setTodos(fetchedTasks);
      } else {
        Alert.alert('Error', 'Failed to fetch tasks.');
      }
    } catch (error) {
      //console.error('Error fetching tasks:', error);
      //Alert.alert('Error', 'Failed to fetch tasks.');
    }
  };

  useEffect(() => {
    loadTasks(token);
  }, [token]);

  const addNewTask = async () => {
    if (task.trim()) {
      try {
        console.log('task is ', task);
        const newTask = await addTask(token, {text: task});
        console.log('newtask is ', newTask);
        if (newTask && typeof newTask === 'object') {
          console.log('New task:', newTask);
          setTodos([...todos, newTask]);
          setTask('');
        } else {
          Alert.alert('Error', 'Failed to add new task.');
        }
      } catch (error) {
        console.error('Error adding task:', error);
        Alert.alert('Error', 'Failed to add new task.');
      }
    }
  };

  const markComplete = async id => {
    try {
      const todo = todos.find(todo => todo.id === id);
      if (todo) {
        const updatedTodo = await updateTask(
          {
            ...todo,
            completed: !todo.completed,
          },
          token,
        );
        setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
      }
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task.');
    }
  };

  const removeTask = async id => {
    try {
      await deleteTask(id, token);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      Alert.alert('Error', 'Failed to delete task.');
    }
  };

  const openEditModal = todo => {
    setEditingTodo(todo);
    setEditModalVisible(true);
  };

  const updateTodo = async updatedTodo => {
    try {
      const result = await updateTask(updatedTodo, token);
      setTodos(todos.map(todo => (todo.id === result.id ? result : todo)));
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task.');
    }
  };

  const handleLogout = () => {
    logout();
    navigation.navigate('Login'); // Adjust this based on your navigation setup
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Updated image source */}
        <Text style={styles.headerTitle}>To-Do List</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter task"
        placeholderTextColor="#888"
        value={task}
        onChangeText={setTask}
      />
      <TouchableOpacity style={styles.addButton} onPress={addNewTask}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => navigation.navigate('ViewTasks')}>
        <Text style={styles.viewButtonText}>View Fetched Tasks</Text>
      </TouchableOpacity>
      <FlatList
        data={todos}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TodoCard
            todo={item}
            onComplete={markComplete}
            onEdit={() => openEditModal(item)}
            onDelete={() => removeTask(item.id)}
          />
        )}
        contentContainerStyle={styles.flatListContainer} // Added margin to FlatList
      />
      <EditTodoModal
        visible={editModalVisible}
        todo={editingTodo}
        onClose={() => setEditModalVisible(false)}
        onUpdate={updateTodo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#17153B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between', // Space between title and logout button
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 50,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#c2eee9',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewButton: {
    backgroundColor: '#AE445A',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatListContainer: {
    marginBottom: 20, // Add margin to avoid list touching edges
  },
  logoutButton: {
    backgroundColor: '#FF6F61', // A distinct color for logout button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
