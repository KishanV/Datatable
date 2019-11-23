import * as React from "react";
import './index.scss';
import {RefObject} from "react";
import {Holder} from "./holder";

export interface Row {
    isSelected?: any | boolean;

    [index: string]: string | number | boolean
}

export interface Column {
    searchable?: boolean;
    id: string,
    label: string,
    type?: 'numeric' | 'string' | 'thumb', // consider default as string.
    url?: string, // apply url on click
    width?: string
}

export interface DatatableProps {
    columns: Column[];
    rows?: Row[];
    onSelectionChange?: (selection: number[] | 'All',) => void;
    onRowClick?: (rowData: Row, rowIndex: number) => void
    onSearch?: (rowData?: Row[]) => void
}

interface State {
    isSelectedAll: boolean,
    isDropdownOpen: boolean,
    filter: 'All' | string,
    search?: string,
    filteredList?: Row[]
}

export const CELL_HEIGHT = 51;
export const CELL_COUNT = 100;

export class Datatable extends React.Component<DatatableProps, State> {
    visibleItem = {
        start: 0,
        end: 200
    };

    selectedIndex: number[] = [];
    state: State = {
        isSelectedAll: false,
        isDropdownOpen: false,
        filter: 'All'
    };

    constructor(props: DatatableProps) {
        super(props);
    }

    getCellClass(type?: any) {
        if (type === 'thumb') {
            return type;
        } else {
            return 'Cell'
        }
    }

    getCellLabel(label: string, type?: string) {
        if (type === 'thumb') {
            return '';
        } else {
            return label;
        }
    }


    titleBar() {
        const columns = this.props.columns;
        return columns.map(value => {
            return <div key={value.label}
                        className={this.getCellClass(value.type)}>{this.getCellLabel(value.label, value.type)}</div>
        });
    }

    bodyRef: RefObject<HTMLDivElement> = React.createRef();
    holderRef: RefObject<Holder> = React.createRef();

    body() {
        if (this.state.filteredList && this.state.filteredList.length === 0) {
            return <div ref={this.bodyRef} className={'Body'}>
                <div className={'No-Data'}>No Any Data Found.</div>
            </div>
        }
        let height = 0;
        if (this.state.filteredList) {
            height = this.state.filteredList.length * CELL_HEIGHT;
        } else if (this.props.rows) {
            height = this.props.rows.length * CELL_HEIGHT;
        }

        return <div ref={this.bodyRef} className={'Body'}>
            {this.props.rows ?
                <div className={'Seized-Body'} style={{height: `${height}px`}}>
                    {<Holder selectedIndex={this.selectedIndex}
                             onRowClick={this.props.onRowClick}
                             onSelectionChange={this.props.onSelectionChange}
                             ref={this.holderRef}
                             columns={this.props.columns}
                             rows={this.state.filteredList ? this.state.filteredList : this.props.rows}/>}
                </div> : <div className={'No-Data'}>Loading...</div>}
        </div>
    }

    onSelectedAll = () => {
        const rows = this.props.rows;
        this.selectedIndex = [];
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
        if (this.props.onSelectionChange) this.props.onSelectionChange('All');
    };

    runFilter(value: string) {
        const filteredList = [];
        const rows = this.props.rows;
        const columns = this.props.columns;
        if (rows) {
            for (let index = 0; index < rows.length; index++) {
                const row = rows[index];
                let found = false;
                for (let num = 0; num < columns.length; num++) {
                    const column = columns[num];
                    if (column.searchable && (this.state.filter === 'All' || this.state.filter === column.label)) {
                        const val = row[column.id].toString() as string;
                        if (val.toLowerCase().startsWith(value)) {
                            found = true;
                            break;
                        }
                    }
                }
                if (found) filteredList.push(row);
            }
        }
        this.resetScroll();
        if (value !== '') {
            this.setState({
                filteredList,
                search: value
            }, () => {
                if (this.props.onSearch) this.props.onSearch(this.state.filteredList);
            });
        } else {
            this.setState({
                filteredList: undefined,
                search: undefined
            }, () => {
                if (this.props.onSearch) this.props.onSearch(this.state.filteredList);
            });
        }
    }

    resetScroll() {
        this.visibleItem.start = 0;
        this.visibleItem.end = 200;
        if (this.holderRef.current) {
            this.holderRef.current.state.visibleItem = this.visibleItem;
        }
    }

    onDropdown(type: string) {
        this.setState({
            filter: type,
            isDropdownOpen: false,
            filteredList: undefined
        }, () => {
            if (this.state.search) {
                this.runFilter(this.state.search);
            }
        });
    }

    search() {
        return <div className={'Search'}>
            <div className={'Holder'}>
                <div className={'Dropdown'} onClick={event1 => {
                    this.setState({
                        isDropdownOpen: !this.state.isDropdownOpen
                    })
                }}>
                    Filter {this.state.filter}
                    <div className={'Icon'}>
                        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect y="4.24268" width="1" height="6" transform="rotate(-45 0 4.24268)" fill="#333333"/>
                            <rect x="7.77817" y="3.53552" width="1" height="6" transform="rotate(45 7.77817 3.53552)"
                                  fill="#333333"/>
                        </svg>
                    </div>
                </div>
                <input placeholder={'Search Item'} className={'Input'} value={this.state.search} onChange={event => {
                    const str = event.target.value.trim().toLowerCase();
                    setTimeout(() => {
                        this.runFilter(str);
                    }, 100);
                }}/>
                {this.state.isDropdownOpen && <div className={'List'}>
                    <div onClick={event1 => {
                        this.onDropdown('All')
                    }} className={'Item'}>All
                    </div>
                    {this.props.columns.map(value => {
                        if (value.searchable !== true) return;
                        return <div key={value.label} onClick={event1 => {
                            this.onDropdown(value.label);
                        }} className={'Item'}>{
                            value.label
                        }</div>
                    })}
                </div>}
            </div>
        </div>;
    }

    render(): React.ReactNode {
        return <div className={'Datatable'}>
            {this.search()}
            <div className={'Data'}>
                <div className={'Title'}>
                    <div className={'Check-Box'}>
                        <div className={'Button'} onClick={this.onSelectedAll}>
                            {this.state.isSelectedAll && <div className={'Surface'}/>}
                        </div>
                    </div>
                    {this.titleBar()}
                </div>
                {this.body()}
            </div>
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