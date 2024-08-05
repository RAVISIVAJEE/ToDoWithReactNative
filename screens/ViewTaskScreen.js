import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {fetchTasks} from '../utils/api';
import {useAuth} from '../AuthContext';
const ViewTaskScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const {token} = useAuth();
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks(token);
        if (Array.isArray(fetchedTasks)) {
          setTasks(fetchedTasks);
        } else {
          console.error('Unexpected data format:', fetchedTasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fetched Tasks</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.card}>
              <Text style={styles.taskText}>{item.text}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e0e0e0',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    padding: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  taskText: {
    fontSize: 18,
    color: '#e0e0e0',
  },
  loadingText: {
    fontSize: 18,
    color: '#e0e0e0',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ViewTaskScreen;
