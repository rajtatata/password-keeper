import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Spinner from 'react-bootstrap/Spinner'

import { registerUser } from '../../utils/server'
import { tokenExpired } from '../../utils/token'
import { showTopModal, setTopModalContent } from '../../store/actions/modals'

import './styles.css'

class Register extends Component {
    state = {
        formSubmited: false
    }

    componentDidMount = () => {
        const { token, history } = this.props
        if (token && !tokenExpired(token)) {
            history.push("/dashboard")
        }
    }

    onLoginClick = () => {
        const { history } = this.props
        history.push("/login")
    }

    onSubmit = async (e) => {
        e.preventDefault()
        const { formSubmited } = this.state
        if (!formSubmited) {
            await this.setState({ formSubmited: true })

            const { showTopModal, setTopModalContent, history } = this.props

            if (this.username.value !== "" && this.password.value !== "") {
                const result = await registerUser(this.username.value, this.password.value, this.email.value)
                if (result.status) {
                    setTopModalContent("Success",
                        `User ${this.username.value} created successfully!`,
                        [
                            { name: "Close", variant: "primary" }
                        ])
                    showTopModal()
                    this.setState({ formSubmited: false })
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
                setTopModalContent("Error", "Username and password are required!",
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
                <Card style={{ height: "fit-content" }} id="register-form">
                    <Card.Body>
                        <Card.Title>Register</Card.Title>
                        <Form onSubmit={this.onSubmit}>
                            <Form.Group as={Row} controlId="formHorizontalEmail">
                                <Form.Label column sm={2}>
                                    Email
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control type="email" placeholder="Email" ref={u => this.email = u} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formHorizontalUsername">
                                <Form.Label column sm={2}>
                                    Username
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control type="text" placeholder="Username" ref={u => this.username = u} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formHorizontalPassword">
                                <Form.Label column sm={2}>
                                    Password
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control type="password" placeholder="Password" ref={p => this.password = p} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Col sm={{ span: 10, offset: 2 }}>
                                    {
                                        formSubmited ? <Spinner animation="border" /> : <Button type="submit">Register</Button>
                                    }
                                    <Button variant="light" style={{ marginLeft: 20 }} onClick={this.onLoginClick}>Login</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Register))