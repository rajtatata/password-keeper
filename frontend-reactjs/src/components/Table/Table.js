import React, { Component } from 'react'
import $ from 'jquery'

import './styles.css'

$.DataTable = require('datatables.net-bs4')

class Table extends Component {

    componentDidMount = () => {
        const { tableId } = this.props
        if (tableId) {
            this.table = $('#' + tableId).DataTable()
            $('.dataTables_length').addClass('bs-select')
        } else {
            this.table = $('#dtBasicExample').DataTable()
            $('.dataTables_length').addClass('bs-select')
        }
    }

    componentWillUpdate = () => {
        this.table.destroy()
    }

    componentDidUpdate = () => {
        const { tableId } = this.props
        if (tableId) {
            this.table = $('#' + tableId).DataTable()
            $('.dataTables_length').addClass('bs-select')
        } else {
            this.table = $('#dtBasicExample').DataTable()
            $('.dataTables_length').addClass('bs-select')
        }
    }

    componentWillUnmount = () => {
        this.table.destroy()
    }

    render() {
        const { headers, body, tableId } = this.props

        if (!headers || !body) {
            return (
                <h3>Error Table: no headers or body found</h3>
            )
        }

        return (
            <table id={tableId || "dtBasicExample"} className="table table-striped table-bordered" cellSpacing="0" >
                <thead>
                    <tr>
                        {
                            headers.map(h => <th className="th-sm">{h}</th>)
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        body.map(tr => {
                            if (tr) {
                                return (
                                    <tr>
                                        {tr.map(td => <td>{td}</td>)}
                                    </tr>
                                )
                            }
                        })
                    }
                </tbody>
            </table>
        )
    }
}

export default Table