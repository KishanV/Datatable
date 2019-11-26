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
    label: string, // display name on user interface.
    type?: 'numeric' | 'string' | 'thumb', // consider default as string.
    width?: string // css style based width for column.
}

export interface DatatableProps {
    columns: Column[]; // columns for table.
    rows: Row[]; // actual data will sen via rows.
    onSelectionChange?: (selection: number[] | 'All',) => void; // will be callback on selection changes if implemented.
    onRowClick?: (rowData: Row, rowIndex: number) => void // will be callback on onRow clicked if implemented.
    onSearch?: (rowData?: Row[]) => void // will be callback on search with collection of searched item as array.
    onRequestMoreData: () => boolean,
    onRequestFilter: (type: string, value: string) => void,
    isSearching?: boolean
}

interface State {
    isSelectedAll: boolean,
    isDropdownOpen: boolean,
    filter: 'All' | string,
    search?: string,
    filteredList?: Row[],
    loadingMoreData: boolean
}

export const CELL_HEIGHT = 51;
export const CELL_COUNT = 50;

export class Datatable extends React.Component<DatatableProps, State> {
    //visibleItem and selectedIndex are separate from state because no need to render on change for performance management.
    visibleItem = {
        start: 0,
        end: 200
    };

    // for cache selection index for quickly replying in callback.
    selectedIndex: number[] = [];

    state: State = {
        isSelectedAll: false,
        isDropdownOpen: false,
        filter: 'All',
        loadingMoreData: false
    };

    componentWillReceiveProps(nextProps: Readonly<DatatableProps>, nextContext: any): void {
        this.state.loadingMoreData = false;
        this.onScroll();
    }

    constructor(props: DatatableProps) {
        super(props);
    }

    // simple utility to generate cell type css class.
    getCellClass(column: Column) {
        const width = column.width;
        if (column.type === 'thumb') {
            return width ? `${column.type} Cell-Sized` : column.type;
        } else {
            return width ? 'Cell-Sized' : 'Cell';
        }
    }

    // simple utility to render cell label.
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
            const width = value.width;
            return <div key={value.label} style={width ? {width: width} : {}}
                        className={this.getCellClass(value)}>{this.getCellLabel(value.label, value.type)}</div>
        });
    }

    // create direct references for body and holder DOM element for later use for performance tuning and only needed part rendering.
    bodyRef: RefObject<HTMLDivElement> = React.createRef();
    holderRef: RefObject<Holder> = React.createRef();

    body() {
        // when user is is using filter and result will be empty then show 'No Any Data Found.' message.
        if (this.props.isSearching) {
            return <div ref={this.bodyRef} className={'Body'}>
                <div className={'No-Data'}>Searching....</div>
            </div>
        }

        // when user is is using filter and result will be empty then show 'No Any Data Found.' message.
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

        // show 'Loading...' while fetching data from server and then render holder with loaded data.
        return <div ref={this.bodyRef} className={'Body'}>
            {this.props.rows ?
                <div className={'Seized-Body'} style={{height: `${height}px`}}>
                    {<Holder {...this.props}
                             ref={this.holderRef}
                             key={this.props.rows.length.toString()}
                             visibleItem={this.visibleItem}
                             selectedIndex={this.selectedIndex}
                             parent={this}/>}
                </div> : <div className={'No-Data'}>Loading...</div>}
        </div>
    }

    onSelectedAll = () => {
        const rows = this.props.rows;
        this.selectedIndex = [];

        // remove all selections on when clicked checkbox in title bar when it is already selected.
        if (this.state.isSelectedAll && rows) {
            for (let index = 0; index < rows.length; index++) {
                delete rows[index].isSelected; // use delete to free up memory and remove selection.
            }
        } else if (rows) {
            for (let index = 0; index < rows.length; index++) {
                rows[index].isSelected = true; // assign true to isSelected for later use in quick render raw via its own component.
                this.selectedIndex.push(index); // pushed index in cache.
            }
        }

        // finally all computation done toggle selection and render entire component again
        this.setState({
            isSelectedAll: !this.state.isSelectedAll
        });

        //called back for onSelectionChange listing.
        if (this.state.isSelectedAll) {
            if (this.props.onSelectionChange) this.props.onSelectionChange('All');
        } else {
            if (this.props.onSelectionChange) this.props.onSelectionChange(this.selectedIndex)
        }
    };

    runFilter(value: string) {
        const columns = this.props.columns;
        for (let num = 0; num < columns.length; num++) {
            const column = columns[num];
            if (this.state.filter === column.label) {
                this.props.onRequestFilter(column.id, value);
                break
            } else if (this.state.filter === 'All') {
                this.props.onRequestFilter('All', value);
                break
            }
        }
        return;
        const filteredList = [];
        const rows = this.props.rows;
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

    loadingMoreData() {
        if (this.state.loadingMoreData) {
            return <div className={'lodingMoreData'}>Loding....</div>;
        }
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
            {this.loadingMoreData()}
        </div>;
    }

    elementBound?: ClientRect; // store element bound for later use.
    onScroll = () => {
        const element = this.bodyRef.current;
        if (this.elementBound && element instanceof HTMLDivElement) {
            const visibleItem = this.visibleItem;
            const startPoint = visibleItem.start * CELL_HEIGHT; // calculate starting pixel as point.
            const endPoint = visibleItem.end * CELL_HEIGHT; // calculate ending pixel as point.
            const scrollTop = element.scrollTop;
            const scrollBottom = scrollTop + this.elementBound.height;
            const scrollHeight = element.scrollHeight;

            if (scrollBottom === scrollHeight) {
                const startLoading = this.props.onRequestMoreData();
                if (startLoading) {
                    this.setState({
                        loadingMoreData: true
                    });
                }
                return;
            }

            // check if item need to be refresh from bottom visibility point of view.
            // than sync holder state directly for avoid render itself and render only needed component.
            if (scrollBottom > endPoint && this.props.rows) {
                const selectedItemIndex = Math.floor(scrollBottom / CELL_HEIGHT);
                const newStart = selectedItemIndex - 100;
                const newEnd = selectedItemIndex + 100;
                this.visibleItem.start = newStart < 0 ? 0 : newStart;
                this.visibleItem.end = newEnd > this.props.rows.length - 1 ? this.props.rows.length - 1 : newEnd;
                if (this.holderRef.current) {
                    this.holderRef.current.setState({});
                }
            }

            // check if item need to be refresh from top visibility point of view.
            if (scrollBottom - this.elementBound.height < startPoint && this.props.rows) {
                const selectedItemIndex = Math.floor(scrollBottom / CELL_HEIGHT);
                const newStart = selectedItemIndex - 100;
                const newEnd = selectedItemIndex + 100;
                this.visibleItem.start = newStart < 0 ? 0 : newStart;
                this.visibleItem.end = newEnd > this.props.rows.length - 1 ? this.props.rows.length - 1 : newEnd;
                if (this.holderRef.current) {
                    this.holderRef.current.setState({});
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