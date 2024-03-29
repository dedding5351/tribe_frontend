import React, { useEffect, useState } from 'react';
import { Button, Col, Modal } from 'react-bootstrap';
import TradeModalTaskCard from '../TradeModalTaskCard'
import { useDispatch, useSelector } from 'react-redux';

interface Task {
    task_id: Number,
    task_name: String,
    associated_points: Number,
    assignee: Array<any>,
    created_by: Number,
    completion_time: String;
}

interface IProps {
    show: Boolean,
    handleClose: Function,
    remove: Function,
    showTradeDuplicate: Function,
}

function TradeModal({show, handleClose, remove, showTradeDuplicate}: IProps) {
    const family_tasks = useSelector((st: any) => st.family_tasks);
    const currUser = useSelector((st: any) => st.user);
    const [tasks, setTasks] = useState(family_tasks);

    useEffect(() => {
        let tasks;

        tasks = family_tasks.filter((t: any) => {
            return t.assignee === currUser.user_id && t.task_status == "open";
        });
        
        setTasks(tasks);
    }, [family_tasks]);
    
    return(
        <Modal show={show} onHide={handleClose}>
            <Modal.Body>
            {tasks.length > 0 ? tasks.map((task: any) => {
                return (/*<Col key={`${task.associated_points}-${task.task_id}`} md={6}>*/
                <TradeModalTaskCard key={`${task.task_id}-card`} task={task} onHide={handleClose} showTradeDuplicate={showTradeDuplicate}/>
                /*</Col>*/)
            }) : <Col md={6}>No tasks to display.</Col>}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => handleClose()}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default TradeModal