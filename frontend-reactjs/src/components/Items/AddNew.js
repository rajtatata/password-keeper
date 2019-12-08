import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Spinner from 'react-bootstrap/Spinner'
import Tooltip from 'react-bootstrap/Tooltip'
import MdRefresh from 'react-ionicons/lib/MdRefresh'
import { connect } from 'react-redux'

import { hideCenteredModal, setTopModalContent, showTopModal } from '../../store/actions/modals'
import { addItem as addItemToState } from '../../store/actions/items'
import { generateKey, encrypt } from '../../utils/crypto'
import { addNewItem as addItemToServer } from '../../utils/server'

class AddNew extends Component {

    state = {
        loading: false
    }

    onSaveClick = async (e) => {
        e.preventDefault()
        const { loading } = this.state
        if (loading) return

        this.setState({ loading: true })
        const { masterKey, setTopModalContent, showTopModal, hideCenteredModal, addItemToState, token } = this.props
        if (masterKey !== null && masterKey !== '') {
            if (this.password.value !== null && this.password.value !== ''
                && this.description.value !== null && this.description.value !== '') {
                const cryptoResult = encrypt(masterKey, this.password.value)
                const serverResponse = await addItemToServer(token, this.description.value, cryptoResult.encryptedData, cryptoResult.nonce)
                if (serverResponse.error) {
                    setTopModalContent("Error", serverResponse.error,
                        [{ name: "Close", variant: "primary" }])
                    showTopModal()
                    hideCenteredModal()
                } else if (serverResponse.item) {
                    addItemToState(serverResponse.item)
                    hideCenteredModal()
                }
            } else {
                setTopModalContent("Error", "Please fill all fields!",
                    [{ name: "Close", variant: "primary" }])
                showTopModal()
            }
        } else {
            hideCenteredModal()
            setTopModalContent("Error", "Please enter the master key!",
                [{ name: "Close", variant: "primary" }])
            showTopModal()
        }
        this.setState({ loading: false })
    }

    onGeneratePass = (e) => {
        e.preventDefault()
        this.password.value = generateKey()
    }

    render() {
        const { loading } = this.state
        return (
            <Form>
                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" placeholder="Enter description" ref={elem => this.description = elem} />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="text" placeholder="Password" ref={elem => this.password = elem} />
                    <OverlayTrigger overlay={<Tooltip id="tooltip-generate">Generate</Tooltip>}>
                        <Button variant="light" onClick={this.onGeneratePass}><MdRefresh size={30} /></Button>
                    </OverlayTrigger>
                </Form.Group>
                {
                    loading ? <Spinner animation="border" /> : <Button variant="primary" type="submit" onClick={this.onSaveClick}>Save</Button>
                }
            </Form>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        hideCenteredModal: () => dispatch(hideCenteredModal()),
        setTopModalContent: (title, body, buttons) => dispatch(setTopModalContent(title, body, buttons)),
        showTopModal: () => dispatch(showTopModal()),
        addItemToState: (data) => dispatch(addItemToState(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNew)