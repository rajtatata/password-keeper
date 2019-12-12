import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'

import AuthenticatedRoute from './components/AuthenticatedRoute/AuthenticatedRoute'
import ForgotPassword from './components/ForgotPass/ForgotPassword'
import ResetPassword from './components/ForgotPass/ResetPassword'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import AdminPanel from './components/AdminPanel/AdminPanel'
import NotFound from './components/NotFound/NotFound'
import TopModal from './components/TopModal/TopModal'
import CenteredModal from './components/CenteredModal/CenteredModal'
import configureStore from './store/configureStore'

const store = configureStore()

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <TopModal />
                <CenteredModal />
                <Router>
                    <Switch>
                        <Route exact path="/" component={Login} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/forgot-password" component={ForgotPassword} />
                        <Route exact path="/reset-password/:passwordResetToken" component={ResetPassword} />
                        <AuthenticatedRoute path="/dashboard" component={AdminPanel} />
                        <Route exact path="/not-found" component={NotFound} />
                        <Redirect to="/not-found" />
                    </Switch>
                </Router>
            </Provider>
        )
    }
}

export default App
