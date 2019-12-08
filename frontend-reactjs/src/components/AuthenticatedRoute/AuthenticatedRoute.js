import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import { tokenExpired } from '../../utils/token'

const authenticatedRoute = (props) => {
    const { token } = props

    if (token && !tokenExpired(token)) {
        return (<Route {...props} />)
    }

    return (<Redirect to="/login" />)
}

const mapStateToProps = state => {
    return {
        token: state.auth.token
    }
}

export default connect(mapStateToProps)(authenticatedRoute)