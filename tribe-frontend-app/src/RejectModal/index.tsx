import React from 'react'
import { Modal, Button} from 'react-bootstrap';

function RejectModal(props: any) {

    return(
        <Modal
        {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <h4>Trade was {`${props.action}`}.</h4>
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}


export default RejectModal