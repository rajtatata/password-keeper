import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import Sidebar from '../Sidebar/Sidebar'
import ItemsView from '../Items/Items'
import UserProfile from '../UserProfile/UserProfile'
import { setItems } from '../../store/actions/items'
import { getItems } from '../../utils/server'
import { showTopModal, setTopModalContent } from '../../store/actions/modals'

class AdminPanel extends Component {

    componentDidMount = async () => {
        const { token, setItems, setTopModalContent } = this.props

        const result = await getItems(token)
        if (result.items) {
            setItems(result.items)
        } else if (result.error) {
            setTopModalContent("Error", result.error, [{
                name: "Close",
                variant: "primary"
            }])
            showTopModal()
        }
    }

    render() {
        return (
            <Sidebar>
                <Switch>
                    <Redirect exact from="/dashboard" to="/dashboard/items" />
                    <Route path="/dashboard/items" component={ItemsView} />
                    <Route path="/dashboard/user" component={UserProfile} />
                    <Redirect to="/not-found" />
                </Switch>
            </Sidebar>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setItems: (data) => dispatch(setItems(data)),
        setTopModalContent: (title, body, buttons) => dispatch(setTopModalContent(title, body, buttons)),
        showTopModal: () => dispatch(showTopModal())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel)

