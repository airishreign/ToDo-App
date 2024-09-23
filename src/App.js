import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([
    { name: 'ITProma Homework', dueDate: '2024-09-25', dueTime: '1:30 PM', completed: false },
    { name: 'AppDev', dueDate: '2024-09-25', dueTime: '7:30 AM', completed: false },
    { name: 'Conchri Presentation', dueDate: '2024-09-24', dueTime: '', completed: false },
    { name: 'Methore Questionnaire', dueDate: '2024-09-25', dueTime: '', completed: false },
  ]);

  const [completedTasks, setCompletedTasks] = useState([]);

  const toggleCompletion = (index) => {
    const taskToComplete = tasks[index];
    setCompletedTasks([...completedTasks, { ...taskToComplete, completed: true }]);
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = completedTasks.filter((_, i) => i !== index);
    setCompletedTasks(updatedTasks);
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
              <Route path="/" element={<ToDo tasks={tasks} toggleCompletion={toggleCompletion} />} />
              <Route path="/task" element={<Task tasks={tasks} setTasks={setTasks} />} />
              <Route path="/completed-tasks" element={<CompletedTasks completedTasks={completedTasks} deleteTask={deleteTask} />} />
              <Route path="/due-date" element={<DueDate tasks={tasks} />} />
            </Routes>
          </div>
        </header>
      </div>
    </Router>
  );
}

function ToDo({ tasks, toggleCompletion }) {
  return (
    <div>
      <h1>To-Do List</h1>
      {tasks.length === 0 ? (
        <div className="empty-message" onClick={() => alert("Take a rest!")}>
          <p>Congratulations! There's nothing to do. Go relax!</p>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.sort((a, b) => new Date(`${a.dueDate}T${a.dueTime || '00:00'}`) - new Date(`${b.dueDate}T${b.dueTime || '00:00'}`))
                .map((task, index) => (
            <li key={index}>
              <div
                className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
                onClick={() => toggleCompletion(index)}
              >
                {task.completed && <i className="fas fa-check"></i>}
              </div>
              <span>{task.name}</span>
              <p>Due Date: {task.dueDate} {task.dueTime && `at ${task.dueTime}`}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Task({ tasks, setTasks }) {
  const [newTask, setNewTask] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDueTime, setNewDueTime] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { name: newTask, dueDate: newDueDate || 'No due date', dueTime: newDueTime, completed: false }]);
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
        <button className="add-task" onClick={addTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.sort((a, b) => new Date(`${a.dueDate}T${a.dueTime || '00:00'}`) - new Date(`${b.dueDate}T${b.dueTime || '00:00'}`))
              .map((task, index) => (
          <li key={index}>
            <span>{task.name}</span>
            <p>Due Date: {task.dueDate} {task.dueTime && `at ${task.dueTime}`}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CompletedTasks({ completedTasks, deleteTask }) {
  return (
    <div>
      <h1>Completed Tasks</h1>
      {completedTasks.length === 0 ? (
        <div className="empty-message" onClick={() => alert("Take the first step, you’ve got this!")}>
          <p>Take the first step, you’ve got this!</p>
        </div>
      ) : (
        <ul className="task-list">
          {completedTasks.sort((a, b) => new Date(`${a.dueDate}T${a.dueTime || '00:00'}`) - new Date(`${b.dueDate}T${b.dueTime || '00:00'}`))
                .map((task, index) => (
          <li key={index}>
            <span>{task.name}</span>
            <p>Due Date: {task.dueDate} {task.dueTime && `at ${task.dueTime}`}</p>
            <button className="delete-task" onClick={() => deleteTask(index)}>Delete</button>
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
        {tasks.sort((a, b) => new Date(`${a.dueDate}T${a.dueTime || '00:00'}`) - new Date(`${b.dueDate}T${b.dueTime || '00:00'}`)).map((task, index) => (
          <li key={index}>
            <span>{task.name}</span>
            <p>Due Date: {task.dueDate} {task.dueTime && `at ${task.dueTime}`}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
