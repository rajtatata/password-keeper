import React, { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { connect } from 'react-redux'

import { hideTopModal } from '../../store/actions/modals'

class TopModal extends Component {

    handleClose = () => {
        this.props.hideModal()
    }

    render() {
        const { title, body, buttons, shown } = this.props
        return (
            <Modal show={shown} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{body}</Modal.Body>
                <Modal.Footer>
                    {
                        buttons ?
                            buttons.map(b => {
                                const { name, variant, onClick } = b
                                if (name === "Close") {
                                    return (
                                        <Button variant={variant} onClick={this.handleClose} key={name}>
                                            {name}
                                        </Button>
                                    )
                                }

                                return (
                                    <Button variant={variant} onClick={onClick}>
                                        {name}
                                    </Button>
                                )
                            })
                            : null

                    }
                </Modal.Footer>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        shown: state.modals.topModal.shown,
        title: state.modals.topModal.title,
        body: state.modals.topModal.body,
        buttons: state.modals.topModal.buttons,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        hideModal: () => dispatch(hideTopModal())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopModal)