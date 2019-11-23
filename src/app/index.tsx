import React = require("react");
import './index.scss';
import {hot} from 'react-hot-loader/root';
import {Datatable} from "../datatable";

export class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <div className={'App'}>
            <Datatable
                columns={[{
                    id: 'albumId',
                    label: 'Album'
                }, {
                    id: 'id',
                    label: 'No'
                }, {
                    id: 'title',
                    label: 'Title'
                }, {
                    id: 'thumbnailUrl',
                    label: 'Thumbnail'
                }]}
                rows={[
                    {
                        "albumId": 1,
                        "id": 1,
                        "title": "accusamus beatae ad facilis cum similique qui sunt",
                        "url": "https://via.placeholder.com/600/92c952",
                        "thumbnailUrl": "https://via.placeholder.com/150/92c952"
                    },
                    {
                        "albumId": 1,
                        "id": 2,
                        "title": "reprehenderit est deserunt velit ipsam",
                        "url": "https://via.placeholder.com/600/771796",
                        "thumbnailUrl": "https://via.placeholder.com/150/771796"
                    },
                    {
                        "albumId": 1,
                        "id": 3,
                        "title": "officia porro iure quia iusto qui ipsa ut modi",
                        "url": "https://via.placeholder.com/600/24f355",
                        "thumbnailUrl": "https://via.placeholder.com/150/24f355"
                    },
                    {
                        "albumId": 1,
                        "id": 4,
                        "title": "culpa odio esse rerum omnis laboriosam voluptate repudiandae",
                        "url": "https://via.placeholder.com/600/d32776",
                        "thumbnailUrl": "https://via.placeholder.com/150/d32776"
                    }
                ]}/>
        </div>;
    }
}

export default hot(App);