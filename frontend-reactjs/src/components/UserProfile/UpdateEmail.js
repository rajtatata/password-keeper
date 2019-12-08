import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'

import { updateUserEmail } from '../../utils/server'
import { setTopModalContent, showTopModal, hideCenteredModal } from '../../store/actions/modals'
import { setLoginToken } from '../../store/actions/auth'

class UpdateEmail extends Component {

    state = {
        loading: false
    }

    componentDidMount = () => {
        const { existingEmail } = this.props
        this.email.value = existingEmail
    }

    onSaveClick = async (e) => {
        e.preventDefault()

        const { loading } = this.state
        if (loading) return

        this.setState({ loading: true })
        const { token, setTopModalContent, showTopModal, setLoginToken, hideCenteredModal } = this.props
        const serverResponse = await updateUserEmail(token, this.email.value)
        if (serverResponse.error) {
            setTopModalContent("Error", serverResponse.error,
                [{ name: "Close", variant: "primary" }])
            showTopModal()
        } else if (serverResponse.token) {
            setLoginToken(serverResponse.token)
        }
        hideCenteredModal()
        this.setState({ loading: false })
    }

    render() {
        const { loading } = this.state        
        return (
            <Form>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" placeholder="Email" ref={elem => this.email = elem} />
                    <Form.Text className="text-muted">
                        Empty value is accepted as valid
                    </Form.Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateEmail)