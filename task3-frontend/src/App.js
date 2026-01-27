import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const savedTasks = localStorage.getItem('saiket-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('saiket-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') {
      alert('Please enter a task!');
      return;
    }

    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      createdAt: new Date().toLocaleString()
    };

    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const deleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const saveEdit = (id) => {
    if (editingText.trim() === '') {
      alert('Task cannot be empty!');
      return;
    }

    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: editingText } : task
    ));
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();
  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1>📝 Task Manager</h1>
          <p className="subtitle">SaiKet Systems - Task 3: React.js To-Do List</p>
        </header>

        <form onSubmit={addTask} className="add-task-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="task-input"
          />
          <button type="submit" className="add-btn">
            ➕ Add Task
          </button>
        </form>

        <div className="stats">
          <div className="stat-item">
            <span className="stat-number">{tasks.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item active">
            <span className="stat-number">{activeCount}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-item completed">
            <span className="stat-number">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'active' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        <div className="tasks-container">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p>🎉 No tasks {filter === 'all' ? 'yet' : filter}!</p>
              {filter === 'all' && <p className="empty-hint">Add your first task above</p>}
            </div>
          ) : (
            <ul className="task-list">
              {filteredTasks.map(task => (
                <li key={task.id} className={task.completed ? 'task-item completed' : 'task-item'}>
                  {editingId === task.id ? (
                    <div className="edit-mode">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="edit-input"
                        autoFocus
                      />
                      <div className="edit-buttons">
                        <button onClick={() => saveEdit(task.id)} className="save-btn">
                          ✓ Save
                        </button>
                        <button onClick={cancelEdit} className="cancel-btn">
                          ✕ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="task-content">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleComplete(task.id)}
                          className="task-checkbox"
                        />
                        <div className="task-text-container">
                          <span className="task-text">{task.text}</span>
                          <span className="task-date">{task.createdAt}</span>
                        </div>
                      </div>
                      <div className="task-actions">
                        <button onClick={() => startEdit(task)} className="edit-btn">
                          ✏️ Edit
                        </button>
                        <button onClick={() => deleteTask(task.id)} className="delete-btn">
                          🗑️ Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="app-footer">
          <p>Built with React.js for SaiKet Systems Internship</p>
          <p>Task 3: Front-End Framework Basics</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
