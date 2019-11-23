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
const CELL_COUNT = 200;

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
        if (rows) {
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

    elementBound?: ClientRect;
    onScroll = (evt: MouseEvent) => {
        const element = this.bodyRef.current;
        if (this.elementBound && element instanceof HTMLDivElement) {
            const visibleItem = this.state.visibleItem;
            const startPoint = visibleItem.start * CELL_HEIGHT;
            const endPoint = visibleItem.end * CELL_HEIGHT;
            const scrollTop = element.scrollTop;
            const scrollBottom = scrollTop + this.elementBound.height;
            if (scrollBottom > endPoint && this.props.rows) {
                const selectedItemIndex = Math.floor(scrollBottom / CELL_HEIGHT);
                const newStart = selectedItemIndex - 100;
                const newEnd = selectedItemIndex + 100;
                this.state.visibleItem.start = newStart < 0 ? 0 : newStart;
                this.state.visibleItem.end = newEnd > this.props.rows.length - 1 ? this.props.rows.length : newEnd;
                this.setState({
                    visibleItem: this.state.visibleItem
                });
            }
            if (scrollBottom - this.elementBound.height < startPoint && this.props.rows) {
                const selectedItemIndex = Math.floor(scrollBottom / CELL_HEIGHT);
                const newStart = selectedItemIndex - 100;
                const newEnd = selectedItemIndex + 100;
                this.state.visibleItem.start = newStart < 0 ? 0 : newStart;
                this.state.visibleItem.end = newEnd > this.props.rows.length - 1 ? this.props.rows.length : newEnd;
                this.setState({
                    visibleItem: this.state.visibleItem
                });
            }
        }
    };

    componentDidMount(): void {
        if (this.bodyRef.current) {
            const element = this.bodyRef.current;
            this.elementBound = element.getBoundingClientRect();
            element.addEventListener('scroll', this.onScroll as any);
        }
    }

    componentWillUnmount(): void {
        if (this.bodyRef.current) {
            const element = this.bodyRef.current;
            this.elementBound = undefined;
            element.removeEventListener('scroll', this.onScroll as any);
        }
    }
}