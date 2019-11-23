import * as React from "react";
import './index.scss';
import {RefObject} from "react";
import {Holder} from "./holder";

export interface Row {
    isSelected?: any | boolean;

    [index: string]: string | number | boolean
}

export interface Column {
    id: string,
    label: string,
    type?: 'numeric' | 'string' | 'thumb', // consider default as string.
    url?: string,// apply url on click
    width?: string
}

export interface DatatableProps {
    columns: Column[];
    rows?: Row[];
}

interface State {
    isSelectedAll: boolean
}

export const CELL_HEIGHT = 51;
export const CELL_COUNT = 100;

export class Datatable extends React.Component<DatatableProps, State> {
    visibleItem = {
        start: 0,
        end: 200
    };

    state: State = {
        isSelectedAll: false
    };

    constructor(props: DatatableProps) {
        super(props);
    }

    titleBar() {
        const columns = this.props.columns;
        return columns.map(value => {
            return <div key={value.label} className={'Cell'}>{value.label}</div>
        });
    }

    bodyRef: RefObject<HTMLDivElement> = React.createRef();
    holderRef: RefObject<Holder> = React.createRef();

    body() {
        return <div ref={this.bodyRef} className={'Body'}>
            {this.props.rows ?
                <div className={'Seized-Body'} style={{height: `${this.props.rows.length * CELL_HEIGHT}px`}}>
                    {<Holder ref={this.holderRef} columns={this.props.columns} rows={this.props.rows}/>}
                </div> : <div className={'No-Data'}>No Data</div>}
        </div>
    }

    onSelectedAll = () => {
        const rows = this.props.rows;
        if (this.state.isSelectedAll && rows) {
            for (let index = 0; index < rows.length; index++) {
                delete rows[index].isSelected;
            }
        } else if (rows) {
            for (let index = 0; index < rows.length; index++) {
                rows[index].isSelected = true;
            }
        }
        this.setState({
            isSelectedAll: !this.state.isSelectedAll
        });
    };

    render(): React.ReactNode {
        return <div className={'Datatable'}>
            <div className={'Title'}>
                <div className={'Check-Box'}>
                    <div className={'Button'} onClick={this.onSelectedAll}>
                        {this.state.isSelectedAll && <div className={'Surface'}/>}
                    </div>
                </div>
                {this.titleBar()}
            </div>
            {this.body()}
        </div>;
    }

    elementBound?: ClientRect;
    onScroll = (evt: MouseEvent) => {
        const element = this.bodyRef.current;
        if (this.elementBound && element instanceof HTMLDivElement) {
            const visibleItem = this.visibleItem;
            const startPoint = visibleItem.start * CELL_HEIGHT;
            const endPoint = visibleItem.end * CELL_HEIGHT;
            const scrollTop = element.scrollTop;
            const scrollBottom = scrollTop + this.elementBound.height;
            if (scrollBottom > endPoint && this.props.rows) {
                const selectedItemIndex = Math.floor(scrollBottom / CELL_HEIGHT);
                const newStart = selectedItemIndex - 100;
                const newEnd = selectedItemIndex + 100;
                this.visibleItem.start = newStart < 0 ? 0 : newStart;
                this.visibleItem.end = newEnd > this.props.rows.length - 1 ? this.props.rows.length : newEnd;
                if (this.holderRef.current) {
                    this.holderRef.current.setState({
                        visibleItem: this.visibleItem
                    })
                }
            }
            if (scrollBottom - this.elementBound.height < startPoint && this.props.rows) {
                const selectedItemIndex = Math.floor(scrollBottom / CELL_HEIGHT);
                const newStart = selectedItemIndex - 100;
                const newEnd = selectedItemIndex + 100;
                this.visibleItem.start = newStart < 0 ? 0 : newStart;
                this.visibleItem.end = newEnd > this.props.rows.length - 1 ? this.props.rows.length : newEnd;
                if (this.holderRef.current) {
                    this.holderRef.current.setState({
                        visibleItem: this.visibleItem
                    })
                }
            }
        }
    };

    onResize = () => {
        this.loadBound();
    };

    loadBound() {
        if (this.bodyRef.current) this.elementBound = this.bodyRef.current.getBoundingClientRect();
    }

    componentDidMount(): void {
        window.addEventListener('onresize', this.onResize);
        this.loadBound();
        if (this.bodyRef.current) this.bodyRef.current.addEventListener('scroll', this.onScroll as any);
    }

    componentWillUnmount(): void {
        window.removeEventListener('onresize', this.onResize);
        if (this.bodyRef.current) this.bodyRef.current.removeEventListener('scroll', this.onScroll as any);
    }
}