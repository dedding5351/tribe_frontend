import React, { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import NewTaskForm from '../NewTaskForm';
import TaskCard from '../TaskCard';
import './DashOverview.css';
import { BASE_URL } from '../config';
import { getCookie } from '../helpers';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTaskFromAPI, postTaskToAPI, updateTaskToAPI } from '../actionCreators';
import FilterBar from '../FilterBar';

interface Task {
  task_id: Number,
  task_name: String,
  associated_points: Number,
  assignee: Array<any>,
  created_by: Number,
  completion_time: String;
}

function DashOverview() {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const family_tasks = useSelector((st: any) => st.family_tasks);
  const dispatch = useDispatch();
  const token = getCookie("x-access-token");
  const loading = useSelector((st: any) => st.loading);

  // GET all the tasks from their family id and display them here as a TaskCard
  const handleClose = () => {
    setShowNewTaskForm(false);
  }

  // TODO: Implement server logic
  const tradeTask = (task_id: Number, recipients: any) => {
    alert(`You've sent trade requests to users #${recipients}.`);
  }

  // TODO: Implement server logic
  const completeTask = async (task_id: Number) => {
    alert("You've completed the task.");
    const res = await fetch(`${BASE_URL}/complete-task`, {
      method: "PATCH",
      body: JSON.stringify({ task_id }),
      headers: {
        "Content-type": "application/json",
        "x-access-token": `${token}`
      },
      credentials: "include"
    });
    if (res.status === 200) {
      console.log("completed");
    }
  }

  // TODO: Implement server logic
  const deleteTask = async (task_id: Number) => {
    dispatch(deleteTaskFromAPI(task_id));
  }

  const postNewTask = async (data: Task) => {
    dispatch(postTaskToAPI(data));
  }

  const updateTask = async (data: Task, currentUserId: Number) => {
    dispatch(updateTaskToAPI(data, currentUserId));
  }

  return (
    <Container className="DashOverview">
      {loading ? <div> loading... </div> :
        <>
          { showNewTaskForm && <NewTaskForm postNewTask={postNewTask} show={showNewTaskForm} handleClose={handleClose} isEdit={false}/>}
          <Row className="d-flex align-items-center">
            <Col md={4}>
              <h1 className="DashOverview-title">
                Task
                Overview
          </h1>
            </Col>
            <Col md={7} className="d-flex justify-content-around align-items-center">
              <Button className="DashOverview-new-task-btn" onClick={() => setShowNewTaskForm(!showNewTaskForm)}>Add Task</Button>
              <FilterBar/>
            </Col>
          </Row>
          <Container fluid className="mt-3">
            <Row>
              {family_tasks.length > 0 ? family_tasks.map((task: any) => {
                return (<Col md={6}>
                  <TaskCard key={task.task_id} task={task} updateTask={updateTask} tradeTask={tradeTask} deleteTask={deleteTask} completeTask={completeTask} />
                </Col>)
              }) : <Col md={6}>No tasks to display.</Col>}
            </Row>
          </Container>
        </>
      }
    </Container>
  )
}

export default DashOverview;