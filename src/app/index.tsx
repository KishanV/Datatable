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
                    id: 'albumId',
                    label: 'Album'
                }, {
                    id: 'id',
                    label: 'No',
                    searchable: true
                }, {
                    id: 'title',
                    label: 'Title',
                    searchable: true
                }]}
                rows={this.state.date}/>
        </div>;
    }
}

export default hot(App);