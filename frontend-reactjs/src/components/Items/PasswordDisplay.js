import React, { Component } from 'react'
import { connect } from 'react-redux'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import MdCopy from 'react-ionicons/lib/MdCopy'
import MdEye from 'react-ionicons/lib/MdEye'
import MdTrash from 'react-ionicons/lib/MdTrash'
import copy from 'clipboard-copy'

import { deleteItem as deleteItemFromState } from '../../store/actions/items'
import { setTopModalContent, showTopModal, hideTopModal } from '../../store/actions/modals'
import { deleteItem as deleteItemFromServer } from '../../utils/server'
import { decrypt } from '../../utils/crypto'

class PasswordDisplay extends Component {

    state = {
        copyText: "Copy",
        passwordText: "●●●●●●●●●●●●●●●●●"
    }

    onCopyClicked = (cryptoResult) => {
        if (cryptoResult.decrypted) {
            copy(cryptoResult.decrypted)
            this.setState({ copyText: "Copied!" })
            setTimeout(() => {
                this.setState({ copyText: "Copy" })
            }, 2000)
        } else {
            this.setState({ copyText: "Text not decrypted!" })
            setTimeout(() => {
                this.setState({ copyText: "Copy" })
            }, 2000)
        }
    }

    onViewClicked = (cryptoResult) => {
        if (cryptoResult.decrypted) {
            this.setState({ passwordText: cryptoResult.decrypted })
            setTimeout(() => {
                this.setState({ passwordText: "●●●●●●●●●●●●●●●●●" })
            }, 4000)
        } else {
            this.setState({ passwordText: "Text not decrypted!" })
            setTimeout(() => {
                this.setState({ passwordText: "●●●●●●●●●●●●●●●●●" })
            }, 4000)
        }
    }

    onDeleteClick = () => {
        const { item, setTopModalContent, showTopModal } = this.props
        setTopModalContent("Delete", `Are you sure you want to delete ${item.description}?`,
            [
                { name: "Close", variant: "primary" },
                { name: "Yes", variant: "secondary", onClick: this.deleteFunction },
            ])
        showTopModal()
    }

    deleteFunction = async () => {
        const { item, token, deleteItemFromState, setTopModalContent, showTopModal, hideTopModal } = this.props
        hideTopModal()
        const serverResponse = await deleteItemFromServer(token, item.id)
        if (serverResponse.error) {
            setTopModalContent("Error", serverResponse.error,
                [{ name: "Close", variant: "primary" }])
            showTopModal()
        } else {
            deleteItemFromState(item)
        }
    }

    render() {
        const { item, masterKey } = this.props
        const { encryptedPass, nonce } = item
        const cryptoResult = decrypt(masterKey, encryptedPass, nonce)

        return (
            <React.Fragment>
                {
                    cryptoResult.decrypted ?
                        <Alert variant="success" style={{ width: "fit-content", float: "left", margin: "auto" }} ref={elem => this.alert = elem}>{this.state.passwordText}</Alert> :
                        <Alert variant="danger" style={{ width: "fit-content", float: "left", margin: "auto" }} ref={elem => this.alert = elem}>{this.state.passwordText}</Alert>
                }
                <OverlayTrigger overlay={<Tooltip id="tooltip-copy">{this.state.copyText}</Tooltip>}>
                    <Button variant="light" style={{ textAlign: "center", margin: 8 }} onClick={() => this.onCopyClicked(cryptoResult)}><MdCopy size={30} /></Button>
                </OverlayTrigger>

                <OverlayTrigger overlay={<Tooltip id="tooltip-view">View</Tooltip>}>
                    <Button variant="warning" style={{ textAlign: "center", margin: 8 }} onClick={() => this.onViewClicked(cryptoResult)}><MdEye size={30} color="white" /></Button>
                </OverlayTrigger>

                <OverlayTrigger overlay={<Tooltip id="tooltip-view">Delete</Tooltip>}>
                    <Button variant="danger" style={{ textAlign: "center", margin: 8 }} onClick={this.onDeleteClick}><MdTrash size={30} color="white" /></Button>
                </OverlayTrigger>

            </React.Fragment>

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
        deleteItemFromState: (item) => dispatch(deleteItemFromState(item)),
        setTopModalContent: (title, body, buttons) => dispatch(setTopModalContent(title, body, buttons)),
        showTopModal: () => dispatch(showTopModal()),
        hideTopModal: () => dispatch(hideTopModal()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordDisplay)