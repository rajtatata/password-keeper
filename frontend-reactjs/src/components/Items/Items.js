import React, { Component } from 'react'
import { connect } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import Table from '../Table/Table'
import LeftContent from './LeftContent'
import PasswordDisplay from './PasswordDisplay'

class Items extends Component {

    state = {
        masterKey: null
    }

    onMasterKeyChange = (text) => {
        this.setState({ masterKey: text })
    }

    render() {
        const stateItems = this.props.items
        return (
            <Container style={{ maxWidth: "100%" }}>
                <Row>
                    <h1 className="mt-4">Items</h1>
                </Row>
                <Row>
                    <Col sm={4}>
                        <LeftContent onMasterKeyChange={this.onMasterKeyChange} />
                    </Col>
                    <Col sm={8}>
                        <Table
                            headers={[
                                "Description",
                                "Password",
                            ]}
                            body={
                                stateItems.map(i => {
                                    return [
                                        i.description,
                                        <PasswordDisplay item={i} masterKey={this.state.masterKey} />,
                                    ]
                                })
                            } />
                    </Col>
                </Row>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        items: state.items.list
    }
}

export default connect(mapStateToProps)(Items)