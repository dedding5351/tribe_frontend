import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import NewTaskForm from '../NewTaskForm';
import TaskCard from '../TaskCard';
import './DashOverview.css';
import { useDispatch, useSelector } from 'react-redux';
import { completeTaskFromAPI, deleteTaskFromAPI, getFamilyTasksFromAPI, getUserFromAPI, postTaskToAPI, updateTaskToAPI } from '../actionCreators';
import FilterBar from '../FilterBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DuplicateTradeModal from '../DuplicateTradeModal';
import ToastNotif from '../ToastNotif';
import userEvent from '@testing-library/user-event';


interface Task {
  task_id: Number,
  task_name: String,
  associated_points: Number,
  assignee: Array<any>,
  created_by: Number,
  completion_time: String;
}

interface IProps {
  showHistory: Boolean
}

/**
 * `DashOverview` component handles the task-related dispatches to
 * handle backend communication and Store updates.
 * 
 * Depending on `showHistory`, it will render Task Overview or (current user's) Task History
 */
function DashOverview({ showHistory }: IProps) {
  // `loading` is true until all required information is received from API.
  const loading = useSelector((st: any) => st.loading);
  const family_tasks = useSelector((st: any) => st.family_tasks);
  const userId = useSelector((st: any) => st.user.user_id);
  const familyManager = useSelector((st: any) => st.user.family_manager);
  const toasts = useSelector((st: any) => st.toasts);

  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [showDuplicateTrade, setShowDuplicateTrade] = useState(false);
  const [tasks, setTasks] = useState(family_tasks);
  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    let tasks;
    if (showHistory) {
      tasks = family_tasks.filter((t: any) => {
        return t.task_status === "completed";
      });
    } else {
      tasks = family_tasks.filter((t: any) => {
        if (t.task_status === "trading" && t.assignee !== userId) {
          return t;
        }
        return t.task_status === "open";
      });
    }
    setTasks(tasks);
  }, [family_tasks, showHistory]);

  const handleClose = () => {
    setShowNewTaskForm(false);
  }

  // TODO: Implement server logic
  const tradeTask = (task_id: Number, recipients: any) => {
    alert(`You've sent trade requests to users #${recipients}.`);
  }

  // TODO: Implement server logic
  const completeTask = async (task_id: Number) => {
    dispatch(completeTaskFromAPI(task_id));
    setShowToast(true);
  }

  // Deletes an existing task on the backend and update the Store.
  const deleteTask = async (task_id: Number) => {
    dispatch(deleteTaskFromAPI(task_id));
  }

  // Posts a new task on the backend and update the Store.
  const postNewTask = async (data: Task) => {
    dispatch(postTaskToAPI(data));
  }

  // Updates an existing task on the backend and update the Store.
  const updateTask = async (data: Task) => {
    dispatch(updateTaskToAPI(data));
  }

  const fetchTasks = async () => {
    dispatch(getFamilyTasksFromAPI());
  }


  // TODO: Migrate and update this filter to another component (maybe the FilterBar component)
  // `filter` filters tasks on the `filterType` to display on UI.
  const filter = (filterType: String) => {
    let filteredTasks: Array<any>;
    switch (filterType) {
      case "unassigned":
        // show unassigned tasks
        filteredTasks = family_tasks.filter((t: any) => {
          return !t.assignee && t.task_status === "open"
        });
        setTasks(filteredTasks);
        break;
      case "myTasks":
        // show currentUser's tasks
        filteredTasks = family_tasks.filter((t: any) => {
          return t.assignee === userId && t.task_status === "open";
        });
        setTasks(filteredTasks);
        break;
      case "completedTasks":
        filteredTasks = family_tasks.filter((t: any) => {
          return t.assignee === userId && t.task_status === "completed";
        });
        setTasks(filteredTasks);
        break;
      case "all":
        // show all active tasks
        filteredTasks = family_tasks.filter((t: any) => {
          if (t.task_status === "trading" && t.assignee !== userId) {
            return t;
          }
          return t.task_status === "open";
        });
        setTasks(filteredTasks);
        break;
      default:
        filteredTasks = family_tasks.filter((t: any) => {
          return t.task_status === "open";
        });
        setTasks(family_tasks);
        break;
    }
  }

  const displayDuplicateTradeModal = () => {
    setShowDuplicateTrade(true)
  }

  const removeTaskUpdate = (task: any) => {
    let newTaskList;

    newTaskList = family_tasks.filter((t: any) => {
      return t.task_status === "open" && t.task_id !== task;
    })

    setTasks(newTaskList)
  }

  return (
    <Container className="DashOverview">
      {loading ? <div> loading... </div> :
        <>
          { showNewTaskForm && <NewTaskForm postNewTask={postNewTask} show={showNewTaskForm} handleClose={handleClose} isEdit={false} task={{}} />}
          <Row className="d-flex align-items-center justify-content-between">
            <Col md={4}>
              <h1 className="DashOverview-title">
                {showHistory ? "Task History" :
                  "Task Overview"}
              </h1>
            </Col>
            {!showHistory &&
              <Col md={7} className="d-flex justify-content-end ml-2 align-items-center">
                {familyManager && <Button className="DashOverview-new-task-btn shadow-none" onClick={() => setShowNewTaskForm(!showNewTaskForm)}><FontAwesomeIcon icon={faPlus} /> Add Task</Button>}
                <FilterBar filter={filter} />
              </Col>
            }
          </Row>
          <Row className="mt-3">
            {tasks.length > 0 ? tasks.map((task: any) => {
              return (<Col key={`${task.associated_points}-${task.task_id}`} md={6}>
                <TaskCard key={`${task.task_id}-card`} task={task} updateTask={updateTask} tradeTask={tradeTask} deleteTask={deleteTask} completeTask={completeTask} removeTask={removeTaskUpdate} showTradeDuplicate={displayDuplicateTradeModal} />
              </Col>)
            }) : <Col md={6}>No tasks to display.</Col>}
          </Row>
        </>
      }
      <DuplicateTradeModal
        show={showDuplicateTrade}
        onHide={() => setShowDuplicateTrade(false)}
      />
      <Button className="DashOverview-fetch-task-btn shadow-none mt-5" onClick={fetchTasks}>Reload tasks</Button>
      <div className="DashOverview-toast-cont">
        {toasts.length ? toasts.map((t: any) => {
          return <ToastNotif key={t.toast_id} msg={t.msg} title={t.title} time={t.time} handleClose={() => setShowToast(false)} show={showToast} toastId={t.toast_id}/>
        }) : ""}
      </div>
    </Container>
  )
}

export default DashOverview;