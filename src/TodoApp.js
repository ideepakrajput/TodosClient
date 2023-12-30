import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from './constant';
import axios from "axios";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import "./TodoApp.css";

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [search, setSearch] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(formatAMPM(new Date()));
    }, 600);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const getTask = async () => {
      const field = "task";
      await axios.get(`${BASE_API_URL}?field=${field}&type=${search}`).then((res) => {
        setTasks(res.data.data);
      })
    }
    getTask();
  }, [task, search, tasks]);


  const handleCreateTask = async () => {
    if (task !== "") {
      await axios.post(`${BASE_API_URL}todo`, { task }).then((res) => {
        if (res.data.status === 200) {
          setTask("");
        }
      })
    }
  }
  const handleDeleteTask = async (ID) => {
    await axios.post(`${BASE_API_URL}delete-todo`, { ID: parseInt(ID) }).then((res) => {
      console.log(res.data);
    });
  }
  const handleUpdateTask = async (taskId, editedTask) => {
    await axios.put(`${BASE_API_URL}todo`, { ID: taskId, task: editedTask });
  }

  const handleStartEdit = (taskId, taskText) => {
    setEditTaskId(taskId);
    setEditedTask(taskText);
  };

  const handleCancelEdit = () => {
    setEditTaskId(null);
    setEditedTask('');
  };

  const handleUpdate = (taskId) => {
    handleUpdateTask(taskId, editedTask);
    setEditTaskId(null);
    setEditedTask('');
  };

  const handleDoneTask = async (ID, isComplete) => {
    await axios.post(`${BASE_API_URL}is-complete`, { ID, isComplete: !isComplete });
  }

  function formatAMPM(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;

    return `${formattedDate} ${formattedTime}`;
  }

  return (
    <div className='container'>
      <div className='box'>
        <div>
          <h1>To Do List</h1>
          <p>{currentTime}</p>
        </div>

        <div className='searchBox'>
          <input placeholder="Search ..." type="text" value={search} onChange={(e) => setSearch(e.target.value)} />

        </div>

        <div>
          {tasks ? (
            <>
              {tasks.map((item, index) => (
                <div key={index} className={`task-card ${item.isComplete ? 'completed' : ''}`}>
                  <div className="task-content">
                    {editTaskId === item.ID ? (
                      <>
                        <input
                          type="text"
                          value={editedTask}
                          onChange={(e) => setEditedTask(e.target.value)}
                        />
                        <button onClick={() => handleUpdate(item.ID)}>
                          <CheckCircleIcon className="icon" />
                          Update
                        </button>
                        <button onClick={handleCancelEdit}>
                          <DeleteIcon className="icon" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>{item.isComplete ? <p style={{ textDecoration: "line-through" }}>{item.task}</p> : <p>{item.task}</p>}</>
                    )}
                  </div>
                  <div className="task-icons">
                    {editTaskId !== item.ID && (
                      <button onClick={() => handleStartEdit(item.ID, item.task)}>
                        <EditIcon className="icon" />
                        Edit
                      </button>
                    )}
                    <button onClick={() => handleDoneTask(item.ID, item.isComplete)}>
                      <CheckCircleIcon className="icon" />
                      Done
                    </button>
                    <button onClick={() => handleDeleteTask(item.ID)}>
                      <DeleteIcon className="icon" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {search ? (
                <p>No match found !</p>
              ) : (
                <p>Well done! All tasks are completed.</p>
              )}
            </>
          )}
        </div>

        <div className='addTodo'>
          <input type="text" placeholder="Enter task..." value={task} onChange={(e) => setTask(e.target.value)} />
          <button onClick={handleCreateTask}><AddIcon /></button>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
