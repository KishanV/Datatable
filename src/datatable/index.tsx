import * as React from "react";
import './index.scss';
import {RefObject} from "react";

interface Props {
    columns: {
        id: string,
        label: string,
        type?: 'numeric' | 'string' | 'thumb', // consider default as string.
        url?: string,// apply url on click
        width?: string
    }[];
    rows?: {
        [index: string]: string | number
    }[];
}

interface State {
    visibleItem: {
        start: number,
        end: number
    }
}

const CELL_HEIGHT = 41;

export class Datatable extends React.Component<Props, State> {
    state: State = {
        visibleItem: {
            start: 0,
            end: 200
        }
    };

    constructor(props: Props) {
        super(props);
    }

    titleBar() {
        const columns = this.props.columns;
        return columns.map(value => {
            return <div key={value.label} className={'Cell'}>{value.label}</div>
        });
    }

    data() {
        const columns = this.props.columns;
        const rows = this.props.rows;
        const visibleItem = this.state.visibleItem;
        const list = [];
        for (let index = visibleItem.start; index < visibleItem.end; index++) {
            const rowValue = rows[index];
            const rawTop = index * CELL_HEIGHT;
            list.push(
                <div key={index} className={'Raw'} style={{top: `${rawTop}px`}}>
                    {columns.map((value1, index1) => {
                        return <div key={value1.label} className={'Cell'}>{rowValue[value1.id]}</div>
                    })}
                </div>
            );
        }
        return list;
    }

    bodyRef: RefObject<HTMLDivElement> = React.createRef();

    body() {
        return <div ref={this.bodyRef} className={'Body'}>
            {this.props.rows ?
                <div className={'Seized-Body'} style={{height: `${this.props.rows.length * CELL_HEIGHT}px`}}>
                    {this.data()}
                </div> : <div className={'No-Data'}>No Data</div>}
        </div>
    }

    render(): React.ReactNode {
        return <div className={'Datatable'}>
            <div className={'Title'}>
                {this.titleBar()}
            </div>
            {this.body()}
        </div>;
    }
}