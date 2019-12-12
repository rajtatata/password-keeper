import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Spinner from 'react-bootstrap/Spinner'

import { login as serverLogin } from '../../utils/server'
import { tokenExpired } from '../../utils/token'
import { setLoginToken } from '../../store/actions/auth'
import { showTopModal, setTopModalContent } from '../../store/actions/modals'

import './styles.css'

class Login extends Component {
    state = {
        formSubmited: false
    }

    componentDidMount = () => {
        const { token, history } = this.props
        if (token && !tokenExpired(token)) {
            history.push("/dashboard")
        }
    }

    onRegisterClick = () => {
        const { history } = this.props
        history.push("/register")
    }

    onSubmit = async (e) => {
        e.preventDefault()
        const { formSubmited } = this.state
        if (!formSubmited) {
            await this.setState({ formSubmited: true })

            const { showTopModal, setTopModalContent, setLoginToken, history } = this.props

            if (this.username.value !== "" && this.password.value !== "") {
                const result = await serverLogin(this.username.value, this.password.value)

                if (result.token) {
                    setLoginToken(result.token)
                    history.push("/dashboard")
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
                await this.setState({ formSubmited: false })
            }
        }
    }

    render() {
        const { formSubmited } = this.state
        return (
            <div className="d-flex justify-content-center flex-fill align-items-center">
                <Card style={{ height: "fit-content" }} id="login-form">
                    <Card.Body>
                        <Card.Title>Login</Card.Title>
                        <Form onSubmit={this.onSubmit}>
                            <Form.Group as={Row} controlId="formHorizontalEmail">
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
                                <Col style={{ textAlign: "center" }}>
                                    {
                                        formSubmited ? <Spinner animation="border" /> : <Button type="submit">Sign in</Button>
                                    }
                                    <Button variant="light" style={{ marginLeft: 20 }} onClick={this.onRegisterClick}>Register</Button>
                                </Col>
                            </Form.Group>
                            <div style={{ textAlign: "center" }}><a href="/forgot-password">Forgot Password?</a></div>
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
        setLoginToken: (token) => dispatch(setLoginToken(token)),
        setTopModalContent: (title, body, buttons) => dispatch(setTopModalContent(title, body, buttons)),
        showTopModal: () => dispatch(showTopModal())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login))