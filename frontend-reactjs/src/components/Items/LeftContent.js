import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { setCenteredModalContent, showCenteredModal } from '../../store/actions/modals'
import AddNew from './AddNew'

class LeftContent extends Component {

    addNewClick = () => {
        const { setCenteredModalContent, showCenteredModal } = this.props
        setCenteredModalContent(
            "Add new password",
            <AddNew masterKey={this.masterKey.value} />,
            [{ name: "Close", variant: "primary" }]
        )
        showCenteredModal()
    }

    onMasterKeyChange = () => {
        this.props.onMasterKeyChange(this.masterKey.value)
    }

    render() {
        return (
            <React.Fragment>
                <Form.Group controlId="formMasterKey" style={{ width: "fit-content" }}>
                    <Form.Label>Master Key</Form.Label>
                    <Form.Control type="password" placeholder="Enter Master Password" ref={elem => this.masterKey = elem} onChange={this.onMasterKeyChange} />
                    <Form.Text className="text-muted">
                        This key will be used to encrypt/decrypt your passwords from the cloud<br/>
                        As you start typing, if the decryption is successfull the colors will change 
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" style={{ marginTop: 20, marginBottom: 50 }} onClick={this.addNewClick}>
                    Add New Item
                </Button>
            </React.Fragment>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setCenteredModalContent: (title, body, buttons) => dispatch(setCenteredModalContent(title, body, buttons)),
        showCenteredModal: () => dispatch(showCenteredModal())
    }
}

export default connect(null, mapDispatchToProps)(LeftContent)