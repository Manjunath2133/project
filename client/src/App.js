// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // Correct import
import axios from 'axios'; // Import axios if not already imported
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Home from './components/Home';
import RegisterForm from './components/RegisterForm'; // Correct import for RegisterForm

const App = () => {
  const handleTaskSubmit = async (task) => {
    try {
      await axios.post('/api/tasks', task);
      alert('Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task');
    }
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/register" component={RegisterForm} />
        <Route path="/tasks/new" render={(props) => <TaskForm {...props} onSubmit={handleTaskSubmit} />} />
        <Route path="/tasks" component={TaskList} />
      </Switch>
    </Router>
  );
};

export default App;
