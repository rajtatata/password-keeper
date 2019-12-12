import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Spinner from 'react-bootstrap/Spinner'

import { resetPassword } from '../../utils/server'
import { tokenExpired } from '../../utils/token'
import { showTopModal, setTopModalContent } from '../../store/actions/modals'

import './styles.css'

class ResetPassword extends Component {
    state = {
        formSubmited: false
    }

    componentDidMount = () => {
        const { token, history } = this.props
        if (token && !tokenExpired(token)) {
            history.push("/dashboard")
        }
    }

    onSubmit = async (e) => {
        e.preventDefault()
        const { formSubmited } = this.state
        const { passwordResetToken } = this.props.match.params
        if (!formSubmited) {
            this.setState({ formSubmited: true })

            const { showTopModal, setTopModalContent, history } = this.props

            if (this.newPassword.value !== "" && this.confirmNewPassword.value !== ""
                && this.newPassword.value === this.confirmNewPassword.value) {
                const result = await resetPassword(passwordResetToken, this.newPassword.value)

                if (result.status) {
                    setTopModalContent("Reset Password",
                        "Your password has been reset!",
                        [
                            { name: "Close", variant: "primary" }
                        ])
                    showTopModal()
                    history.push("/login")
                } else if (result.error) {
                    setTopModalContent("Error",
                        result.error,
                        [
                            { name: "Close", variant: "primary" }
                        ])
                    showTopModal()
                    this.setState({ formSubmited: false })
                }
            } else {
                setTopModalContent("Error", "Check Password fields!",
                    [{ name: "Close", variant: "primary" }])
                showTopModal()
                this.setState({ formSubmited: false })
            }
        }
    }

    render() {
        const { formSubmited } = this.state
        return (
            <div className="d-flex justify-content-center flex-fill align-items-center">
                <Card style={{ height: "fit-content" }} id="resetPass-form">
                    <Card.Body>
                        <Card.Title>Reset Password</Card.Title>
                        <Form onSubmit={this.onSubmit}>
                            <Form.Group as={Row} controlId="newPass">
                                <Form.Label column sm={2}>New Password</Form.Label>
                                <Col sm={10}>
                                    <Form.Control type="password" placeholder="New Password" ref={elem => this.newPassword = elem} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="confirmNewPass">
                                <Form.Label column sm={2}>Confirm Password</Form.Label>
                                <Col sm={10}>
                                    <Form.Control type="password" placeholder="Confirm Password" ref={elem => this.confirmNewPassword = elem} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Col sm={{ span: 10, offset: 2 }}>
                                    {
                                        formSubmited ? <Spinner animation="border" /> : <Button type="submit">Save</Button>
                                    }
                                </Col>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
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
        setTopModalContent: (title, body, buttons) => dispatch(setTopModalContent(title, body, buttons)),
        showTopModal: () => dispatch(showTopModal())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ResetPassword))