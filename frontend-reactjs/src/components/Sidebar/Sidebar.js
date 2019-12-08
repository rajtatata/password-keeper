import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import $ from 'jquery'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/Button'

import './styles.css'
import { setLoginToken } from '../../store/actions/auth'
import { setItems } from '../../store/actions/items'

class Sidebar extends Component {

    componentDidMount = () => {
        $("#menu-toggle").click(function (e) {
            e.preventDefault()
            $("#wrapper").toggleClass("toggled")
        })

        window.onscroll = () => {
            $("#sidebar-wrapper").css("top", window.pageYOffset)
        }
    }

    onLogout = () => {
        const { setLoginToken, setItems } = this.props
        setLoginToken(null)
        setItems([])
    }

    render() {
        return (
            <div className="d-flex flex-fill" id="wrapper">
                <div className="bg-light border-right" id="sidebar-wrapper">
                    <div className="sidebar-heading">Password Keeper</div>
                    <div className="list-group list-group-flush">
                        <Link to="/dashboard/items" className="list-group-item list-group-item-action bg-light">Items</Link>
                        <Link to="/dashboard/user" className="list-group-item list-group-item-action bg-light">User Profile</Link>
                    </div>
                </div>

                <div id="page-content-wrapper">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                        <Button className="btn btn-primary" id="menu-toggle" variant="info">Toggle Sidebar</Button>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link" onClick={this.onLogout}>Logout</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <div className="container-fluid">
                        {this.props.children}
                    </div>
                </div>

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
        setItems: (data) => dispatch(setItems(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)