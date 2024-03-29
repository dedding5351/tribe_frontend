import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import Trade from '../Trade'
import { getOutGoingTrades, getPendingTask, gotPendingTask, incomingTradesHash, setIsFetched } from '../actionCreators';
import RejectModal from '../RejectModal';

interface Task {
    task_id: Number,
    task_name: String,
    associated_points: Number,
    assignee: Array<any>,
    created_by: Number,
    completion_time: String,
}



function TradesTab(props: any) {
    const pending_tasks = useSelector((st: any) => st.pendingTask)
    const tradesList = useSelector((st: any) => st.listOfTradeTask)
    const outgoing_Trades = useSelector((st: any) => st.outGoingTrades) 
    const isFetched = useSelector((st: any) =>  st.isFetched)  
    const [rejectFeedBack, setRejectFeedBack] = useState(false) 
    const [actionToTrade, setActionToTrade] = useState('')
    
    const dispatch = useDispatch();

    useEffect(() => {
        if(!isFetched){
            dispatch(getPendingTask())
	        dispatch(getOutGoingTrades())
            dispatch(setIsFetched(true))
            console.log("yo ")
        }
    }, []);

    const handleTaskLoading = () =>{
        dispatch(getPendingTask())
		dispatch(getOutGoingTrades())
    }

    const tradeAction = (action: any) => {
        setActionToTrade(action)
        setRejectFeedBack(true)
    }

    return(
        <Container>
            <Col md={4}>
                <h1 className="DashOverview-title">Pending Trades</h1>
            </Col>
            <Row className="mt-3">
                {pending_tasks.length > 0 ? pending_tasks.map((trade: any) => {
                    return (<Col key={`${trade[2]}-${trade[2]}`} md={6}>
                    <Trade key={`${trade[2]}-card`} trade={trade} isIncoming={true} feedBack={handleTaskLoading} showRejectedModal={tradeAction}/>
                    </Col>)
                }) : <Col md={6}>No tasks to display.</Col>}
            </Row>
            <br/>
            <Col md={4}>
                <h1 className="DashOverview-title">Outgoing Trades</h1>
            </Col>
            <Row className="mt-3">
                {outgoing_Trades.length > 0 ? outgoing_Trades.map((trade: any) => {
                    return (<Col key={`${trade[2]}-${trade[2]}`} md={6}>
                    <Trade key={`${trade.task_id}-card`} trade={trade} isIncoming={false} feedBack={handleTaskLoading} showRejectedModal={tradeAction}/>
                    </Col>)
                }) : <Col md={6}>No tasks to display.</Col>}
            </Row>
            <RejectModal
                show={rejectFeedBack}
                onHide={() => {
                    setRejectFeedBack(false)
                    handleTaskLoading()
                }}
                action={actionToTrade}
            />
        </Container>
    )
}

export default TradesTab