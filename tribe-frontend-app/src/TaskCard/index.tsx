import React, { useState } from 'react';
import { Button, Col, Container, Image, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import moment from "moment";
import './TaskCard.css';
import { DEFAULT_PFP } from '../config';
import { useSelector, useDispatch } from 'react-redux';
import TaskCardDetailsModal from '../TaskCardDetailsModal';
import TradeModal from '../TradeModal'
import { counterParty } from '../actionCreators';

interface IProps {
    task: any,
    deleteTask: Function,
    tradeTask: Function,
    completeTask: Function,
    updateTask: Function,
    removeTask: any,
    showTradeDuplicate: Function,
}

/**
 * TaskCard component displays each task.
 * Handler functions to delegate task-related CRUD operations.
 */
function TaskCard({ task, deleteTask, tradeTask, completeTask, updateTask, removeTask, showTradeDuplicate }: IProps) {
    const [showDelConf, setShowDelConf] = useState(false);
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [showTaskDetails, setShowTaskDetails] = useState(false);
    const user = useSelector((st: any) => st.user);
    const famMembers = useSelector((st: any) => st.famMembers)
    const isTaskOwner = (task.assignee === user.user_id);
    const dispatch = useDispatch();
    

    // `taskOwner` is a user object of the task's `created_by` user.
    const taskOwner = famMembers.filter((memb: any) => {
        return task.created_by === memb.user_id;
    })[0];

    /*filter for the assignees' informations to display
        - This is kept incase future updates involve multiple assignees to a task.
    */
    let assignees = famMembers.filter((memb: any) => {
        return task.assignee === memb.user_id;
    });

    const handleTaskDelete = () => {
        deleteTask(task.task_id);
        // close the delete confirmation notice.
        setShowDelConf(false);
    }

    const handleTradeTask = (data: any) => {
        setShowTradeModal(true)
        dispatch(counterParty(task.task_id, task.assignee))
        // tradeTask(task.task_id, data.recipients);
    }

    const handleCompleteTask = () => {
        completeTask(task.task_id);
    }

    const handleUpdateTask = (updatedTask: any) => {
        // task_id is appended to the updatedTask formData object 
        // for backend PATCH.
        updatedTask.task_id = task.task_id;
        updateTask(updatedTask, user.user_id);
    }

    // avatar dynamic styling: if more than one assignee. (future update)
    let rightPosition = -30
    let zIdx = assignees.length;

    return (
        <div className="TaskCard">
            <TradeModal show={showTradeModal} handleClose={() => setShowTradeModal(false)} remove={removeTask} showTradeDuplicate={showTradeDuplicate}/>
            <TaskCardDetailsModal show={showTaskDetails} handleUpdateTask={handleUpdateTask} handleClose={() => setShowTaskDetails(false)} task={task} taskOwner={taskOwner} isFamilyAdmin={user.family_manager} />
            {assignees.map((assignee: any) => {
                // increment and decrement avatar styling variables.
                rightPosition += 30;
                zIdx--;
                return (
                    <div style={{ right: rightPosition, zIndex: zIdx }} key={assignee.user_id} className="TaskCard-img-wrapper">
                        <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={<Tooltip className="TaskCard-tooltip" id={`tooltip-${assignee.user_id}`}>{assignee.first_name}</Tooltip>}
                        >
                            <Image className="TaskCard-img" src={assignee.user_avatar || DEFAULT_PFP} />
                        </OverlayTrigger>
                    </div>
                );
            })}
            <Container className="TaskCard-details">
                {/**DELETE button if current user is a `family_manager`*/}
                {user.family_manager && <div className="TaskCard-delete-btn">
                    <FontAwesomeIcon style={{ cursor: "pointer" }} icon={faTimes} size="2x" onClick={() => setShowDelConf(!showDelConf)} />
                </div>}
                {showDelConf ?
                    // HTML for task deletion confirmation 
                    <Row className="d-flex align-items-center justify-content-between">
                        <Col sm={6} md={6}>
                            <h4>Delete task for {task.task_name}?</h4>
                        </Col>
                        <Col sm={6} md={6}>
                            <Button className="TaskCard-btn TaskCard-btn-yes" onClick={handleTaskDelete}>Yes</Button>
                            <Button className="TaskCard-btn TaskCard-btn-no" onClick={() => setShowDelConf(false)}>No</Button>
                        </Col>
                    </Row>
                    :
                    // HTML for task details 
                    <Row className="d-flex align-items-center justify-content-between">
                        <Col sm={6} md={7} onClick={() => setShowTaskDetails(true)}>
                            <Row className="TaskCard-header">
                                <h3>{task.task_name}<span className="TaskCard-pts">+{task.associated_points}pts</span></h3>
                            </Row>
                            <Row>
                                <p className="TaskCard-description">
                                    {task.task_description}
                                </p>
                            </Row>
                            <Row>
                                <div className="TaskCard-deadline text-left">
                                    {task.completed ? `completed ${moment(new Date(task.completion_time).toString()).calendar()}` : `posted ${moment(new Date(task.created_at).toString()).calendar()} by ${taskOwner.first_name}`}
                                </div>
                            </Row>
                        </Col>
                        {task.task_status !== "completed" && <Col sm={6} md={5}>
                            {isTaskOwner ?
                                <Button className="TaskCard-btn TaskCard-complete-btn"  onClick={handleCompleteTask}>Complete</Button>
                                : <Button className="TaskCard-btn TaskCard-trade-btn" onClick={handleTradeTask}>Trade</Button>
                            }
                        </Col> } 
                    </Row>
                }
            </Container>
        </div>
    )
}

export default TaskCard;