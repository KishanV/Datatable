import * as React from "react";
import './index.scss';

interface Props {
    columns: {
        id: string,
        label: string,
        type?: 'numeric' | 'string' | 'thumb', // consider default as string.
        url?:string,// apply url on click
        width?: string
    }[];
    rows: {
        [index: string]: string
    }[];
}

interface State {

}

export class Datatable extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render(): React.ReactNode {
        return <div className={'Datatable'}></div>;
    }
}