import React = require("react");
import './index.scss';
import {hot} from 'react-hot-loader/root';
import {Datatable} from "../datatable";

interface State {
    date?: any
}

export class App extends React.Component<any, State> {
    state: State = {};

    constructor(props: any) {
        super(props);
        this.loadData();
    }

    async loadData() {
        let response = await fetch("https://jsonplaceholder.typicode.com/photos");
        if (response.ok) {
            let json = await response.json();
            this.setState({
                date: json
            })
        }
    }

    render() {
        return <div className={'App'}>
            <Datatable
                columns={[{
                    id: 'thumbnailUrl',
                    label: 'Thumbnail',
                    type: 'thumb'
                }, {
                    id: 'id',
                    label: 'No',
                    searchable: true,
                    type: 'numeric',
                    width: '100px'
                }, {
                    id: 'albumId',
                    label: 'Album No',
                    type: 'numeric',
                    width: '20%'
                }, {
                    id: 'title',
                    label: 'Title',
                    searchable: true
                }]}
                rows={this.state.date}
                onSelectionChange={selection => {
                    console.log('onSelectionChange =>', selection)
                }}
                onRowClick={(data, rowIndex) => {
                    console.log('onRowClick => data =', data, 'index =', rowIndex)
                }}
                onSearch={data => {
                    console.log('onSearch => ', data)
                }}
            />
        </div>;
    }
}

export default hot(App);