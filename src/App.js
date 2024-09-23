import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);

  const toggleCompletion = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addTask = (name, dueDate, dueTime) => {
    const newTask = { id: Date.now(), name, dueDate: dueDate || 'No due date', dueTime, completed: false, editing: false };
    setTasks([...tasks, newTask]);
  };

  const editTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, editing: true } : task));
  };

  const saveTask = (id, newName, newDueDate, newDueTime) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, name: newName, dueDate: newDueDate, dueTime: newDueTime, editing: false } : task
    ));
  };

  return (
    <Router>
      <div className="App">
        <header>
          <div className="sidebar">
            <h2>MEMO</h2>
            <ul>
              <li><Link to="/">To-Do</Link></li>
              <li><Link to="/task">Add Task</Link></li>
              <li><Link to="/completed-tasks">Completed Tasks</Link></li>
              <li><Link to="/due-date">Due Date</Link></li>
            </ul>
          </div>
          <div className="content">
            <Routes>
              <Route path="/" element={<ToDo tasks={tasks} toggleCompletion={toggleCompletion} editTask={editTask} saveTask={saveTask} deleteTask={deleteTask} />} />
              <Route path="/task" element={<Task addTask={addTask} />} />
              <Route path="/completed-tasks" element={<CompletedTasks completedTasks={tasks.filter(task => task.completed)} deleteTask={deleteTask} />} />
              <Route path="/due-date" element={<DueDate tasks={tasks} />} />
            </Routes>
            <Link to="/task" className="add-task-button">+</Link>
          </div>
        </header>
      </div>
    </Router>
  );
}

function ToDo({ tasks, toggleCompletion, editTask, saveTask, deleteTask }) {
  return (
    <div>
      <h1>To-Do List</h1>
      {tasks.length === 0 ? (
        <div className="empty-message">
          <p>No todos available. Add a todo to get started!</p>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <div
                className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
                onClick={() => toggleCompletion(task.id)}
              >
                {task.completed && <i className="fas fa-check"></i>}
              </div>
              {task.editing ? (
                <input
                  type="text"
                  defaultValue={task.name}
                  onBlur={(e) => saveTask(task.id, e.target.value, task.dueDate, task.dueTime)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      saveTask(task.id, e.target.value, task.dueDate, task.dueTime);
                    }
                  }}
                />
              ) : (
                <span>{task.name}</span>
              )}
              <p>Due Date: {task.dueDate} {task.dueTime && `at ${task.dueTime}`}</p>
              <button onClick={() => editTask(task.id)} disabled={task.completed || task.editing}>Edit</button>
              <button onClick={() => deleteTask(task.id)} disabled={task.completed || task.editing}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Task({ addTask }) {
  const [newTask, setNewTask] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDueTime, setNewDueTime] = useState('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(newTask, newDueDate, newDueTime);
      setNewTask('');
      setNewDueDate('');
      setNewDueTime('');
    }
  };

  return (
    <div>
      <h1>Add Task</h1>
      <div className="new-task">
        <input
          type="text"
          placeholder="Enter a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
        />
        <input
          type="time"
          value={newDueTime}
          onChange={(e) => setNewDueTime(e.target.value)}
        />
        <button className="add-task" onClick={handleAddTask}>Add Task</button>
      </div>
    </div>
  );
}

function CompletedTasks({ completedTasks, deleteTask }) {
  return (
    <div>
      <h1>Completed Tasks</h1>
      {completedTasks.length === 0 ? (
        <div className="empty-message">
          <p>No completed tasks!</p>
        </div>
      ) : (
        <ul className="task-list">
          {completedTasks.map((task) => (
            <li key={task.id}>
              <span>{task.name}</span>
              <p>Due Date: {task.dueDate} {task.dueTime && `at ${task.dueTime}`}</p>
              <button className="delete-task" onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DueDate({ tasks }) {
  return (
    <div>
      <h1>Tasks by Due Date</h1>
      <ul className="task-list">
        {tasks.sort((a, b) => new Date(`${a.dueDate}T${a.dueTime || '00:00'}`) - new Date(`${b.dueDate}T${b.dueTime || '00:00'}`)).map((task) => (
          <li key={task.id}>
            <span>{task.name}</span>
            <p>Due Date: {task.dueDate} {task.dueTime && `at ${task.dueTime}`}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
