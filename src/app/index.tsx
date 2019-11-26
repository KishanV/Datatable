import React = require("react");
import './index.scss';
import {hot} from 'react-hot-loader/root';
import {Datatable} from "../datatable";

interface State {
    date: any[],
    loadedPage: number,
    canLoad: boolean,
    searchQuery?: string,
    isSearching: boolean
}

export class App extends React.Component<any, State> {
    state: State = {
        date: [],
        loadedPage: 0,
        canLoad: true,
        isSearching: false
    };

    constructor(props: any) {
        super(props);
        this.loadData();
    }

    async loadData() {
        const loadedPage = this.state.loadedPage + 1;
        const data = this.state.date;
        let response = await fetch(`https://jsonplaceholder.typicode.com/photos?_page=${loadedPage}&_limit=200${this.state.searchQuery ? '&' + this.state.searchQuery : ''}`);
        if (response.ok) {
            let json = await response.json();
            if (json.length === 0) {
                this.setState({
                    isSearching: false,
                    date: data,
                    canLoad: false
                });
            } else {
                const newData = data.concat(json);
                this.setState({
                    isSearching: false,
                    date: newData,
                    loadedPage
                })
            }
        }
    }

    render() {
        return <div className={'App'}>
            <Datatable
                isSearching={this.state.isSearching}
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
                    console.log('onSearch => ', data);
                }}

                onRequestMoreData={() => {
                    if (this.state.canLoad) {
                        this.loadData();
                        console.log('Start loading more data.');
                    } else {
                        console.log('Can not load more data.');
                    }
                    return this.state.canLoad;
                }}

                onRequestFilter={(type, value) => {
                    let searchQuery;
                    if (type === 'All') {
                        searchQuery = `q=${value}`;
                    } else {
                        searchQuery = `${type}_like=${value}`;
                    }
                    this.setState({
                        canLoad: true,
                        searchQuery: searchQuery,
                        date: [],
                        loadedPage: 0,
                        isSearching: true
                    }, () => {
                        this.loadData()
                    });
                }}
            />
        </div>;
    }
}

export default hot(App);