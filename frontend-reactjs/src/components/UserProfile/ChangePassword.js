import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'

import { changeUserPass } from '../../utils/server'
import { setTopModalContent, showTopModal, hideCenteredModal } from '../../store/actions/modals'
import { setLoginToken } from '../../store/actions/auth'

class ChangePassword extends Component {

    state = {
        loading: false
    }

    onSaveClick = async (e) => {
        e.preventDefault()

        const { loading } = this.state
        if (loading) return

        this.setState({ loading: true })
        const { token, setTopModalContent, showTopModal, setLoginToken, hideCenteredModal } = this.props
        const serverResponse = await changeUserPass(token, this.oldPassword.value, this.newPassword.value)
        if (serverResponse.error) {
            setTopModalContent("Error", serverResponse.error,
                [{ name: "Close", variant: "primary" }])
            showTopModal()
        } else if (serverResponse.status) {
            setTopModalContent("Success", "Password changed successfully!",
                [{ name: "Close", variant: "primary" }])
            showTopModal()
            setLoginToken(null)
        }
        hideCenteredModal()
        this.setState({ loading: false })
    }

    render() {
        const { loading } = this.state
        return (
            <Form>
                <Form.Group controlId="oldPass">
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" ref={elem => this.oldPassword = elem} />
                </Form.Group>
                <Form.Group controlId="newPass">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" ref={elem => this.newPassword = elem} />
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
        setLoginToken: (token) => dispatch(setLoginToken(token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword)