import React from 'react';
import TaskCard from './TaskCard';
import './App.css';
import Login from './Login';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <TaskCard/> */}
        <Login/>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
