import React, { Fragment } from 'react'
import Feedback from 'react-bootstrap/esm/Feedback'
import OutGoingTradeTaskCard from '../OutGoingTradeTaskCard'
import PendingTradeTaskCard from '../PendingTradeTaskCard'
// import './trade.css'

interface IProps{
    trade: [task: {}, task: {}, tradeId: Number ],
    isIncoming: boolean,
    feedBack: Function
}

function Trade ({ trade, isIncoming, feedBack } :IProps){
    let sourceTask = trade[0]
    let counterPartyTask = trade[1]
    let tradeId = trade[2]

    return(
        <div className="trade">
            {isIncoming ? 
                <Fragment>
                    <PendingTradeTaskCard task={counterPartyTask} tradeId={tradeId} feedBack={feedBack}/>
                    <PendingTradeTaskCard task={sourceTask} tradeId={tradeId} feedBack={feedBack}/>
                </Fragment>:
                <Fragment>
                    <OutGoingTradeTaskCard task={sourceTask} tradeId={tradeId} feedBack={feedBack}/>
                    <OutGoingTradeTaskCard task={counterPartyTask} tradeId={tradeId} feedBack={feedBack}/>
                </Fragment>
            }
        </div>
    )
}

export default Trade