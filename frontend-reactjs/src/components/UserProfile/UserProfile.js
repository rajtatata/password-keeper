import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { decodeToken } from '../../utils/token'
import { setCenteredModalContent, showCenteredModal, setTopModalContent, showTopModal, hideTopModal } from '../../store/actions/modals'
import UpdateEmail from './UpdateEmail'
import ChangePassword from './ChangePassword'
import { deleteUserAccount } from '../../utils/server'
import { setLoginToken } from '../../store/actions/auth'

class UserProfile extends Component {
    onUpdateEmailClick = () => {
        const { setCenteredModalContent, showCenteredModal, token } = this.props
        const tokenDecoded = decodeToken(token)

        setCenteredModalContent(
            "Update Email",
            <UpdateEmail existingEmail={tokenDecoded.email || ""} />,
            [{ name: "Close", variant: "primary" }]
        )
        showCenteredModal()
    }

    onChangePasswordClick = () => {
        const { setCenteredModalContent, showCenteredModal } = this.props

        setCenteredModalContent(
            "Change Password",
            <ChangePassword />,
            [{ name: "Close", variant: "primary" }]
        )
        showCenteredModal()
    }

    onDeleteAccountClick = () => {
        const { setTopModalContent, showTopModal } = this.props

        setTopModalContent("Delete Account", "Your data will also be deleted. Are you sure you want to continue?",
            [
                { name: "Close", variant: "primary" },
                { name: "Yes", variant: "secondary", onClick: this.onDeleteAccept },

            ])
        showTopModal()
    }

    onDeleteAccept = async () => {
        const { token, history, setTopModalContent, showTopModal, setLoginToken, hideTopModal } = this.props
        const serverResponse = await deleteUserAccount(token)
        if (serverResponse.error) {
            setTopModalContent("Error", serverResponse.error,
                [{ name: "Close", variant: "primary" }])
            showTopModal()
        } else if (serverResponse.status) {
            setLoginToken(null)
            history.push("/login")
            hideTopModal()
        }
    }

    render() {
        const { token } = this.props
        const tokenDecoded = decodeToken(token)
        return (
            <Container style={{ maxWidth: "100%" }}>
                <Row>
                    <h1 className="mt-4">User Profile</h1>
                </Row>
                <Row>
                    <Col>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Username: <strong>{tokenDecoded.username || "N/A"}</strong></ListGroup.Item>
                            <ListGroup.Item>Email: <strong>{tokenDecoded.email || "N/A"}</strong></ListGroup.Item>
                        </ListGroup>
                    </Col>

                    <Col>
                        <ListGroup>
                            <ListGroup.Item action onClick={this.onUpdateEmailClick}>Update Email</ListGroup.Item>
                            <ListGroup.Item action onClick={this.onChangePasswordClick} >Change Password</ListGroup.Item>
                            <ListGroup.Item action variant="danger" onClick={this.onDeleteAccountClick} >Delete my account</ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
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
        setCenteredModalContent: (title, body, buttons) => dispatch(setCenteredModalContent(title, body, buttons)),
        showCenteredModal: () => dispatch(showCenteredModal()),
        setTopModalContent: (title, body, buttons) => dispatch(setTopModalContent(title, body, buttons)),
        showTopModal: () => dispatch(showTopModal()),
        hideTopModal: () => dispatch(hideTopModal()),
        setLoginToken: (token) => dispatch(setLoginToken(token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserProfile))