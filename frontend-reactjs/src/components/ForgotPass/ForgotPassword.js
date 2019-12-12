import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Spinner from 'react-bootstrap/Spinner'

import { forgotPassword } from '../../utils/server'
import { tokenExpired } from '../../utils/token'
import { showTopModal, setTopModalContent } from '../../store/actions/modals'

import './styles.css'

class ForgotPassword extends Component {
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
        if (!formSubmited) {
            this.setState({ formSubmited: true })

            const { showTopModal, setTopModalContent, history } = this.props

            if (this.email.value !== "") {
                const result = await forgotPassword(this.email.value)

                if (result.status) {
                    setTopModalContent("Forgot Password",
                        "Your password link has been sent to your email!",
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
                    await this.setState({ formSubmited: false })
                }
            } else {
                setTopModalContent("Error", "Email is required!",
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
                <Card style={{ height: "fit-content" }} id="forgotPass-form">
                    <Card.Body>
                        <Card.Title>Forgot Password</Card.Title>
                        <Form onSubmit={this.onSubmit}>
                            <Form.Group as={Row} controlId="formHorizontalEmail">
                                <Form.Label column sm={2}>Email</Form.Label>
                                <Col sm={10}>
                                    <Form.Control type="text" placeholder="Enter your email" ref={elem => this.email = elem} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Col sm={{ span: 10, offset: 2 }}>
                                    {
                                        formSubmited ? <Spinner animation="border" /> : <Button type="submit">Send email</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ForgotPassword))