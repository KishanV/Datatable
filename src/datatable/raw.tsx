import * as React from "react";
import {Column, Row} from "./index";

interface Props {
    selectedIndex: number[]
    columns: Column[],
    top: number,
    value: Row,
    index: number,
    onSelectionChange?: (selection: number[] | 'All') => void;
    onRowClick?: (rowData: Row, rowIndex: number) => void
}

export class Raw extends React.Component<Props, any> {

    constructor(props: Props) {
        super(props);
    }

    onSelected = () => {
        if (this.props.value.isSelected) {
            const indexOf = this.props.selectedIndex.indexOf(this.props.index);
            if (indexOf !== -1) {
                this.props.selectedIndex.splice(indexOf, 1);
                if (this.props.onSelectionChange) this.props.onSelectionChange(this.props.selectedIndex)
            }
            delete this.props.value.isSelected;
        } else {
            this.props.value.isSelected = true;
            this.props.selectedIndex.push(this.props.index);
            if (this.props.onSelectionChange) this.props.onSelectionChange(this.props.selectedIndex)
        }
        this.setState({});
    };

    cell(value: Column) {
        if (value.type === 'thumb') {
            return <div key={value.label}
                        className={'Thumb'}>
                <div style={{backgroundImage: `url(${this.props.value[value.id]})`}} className={'image'}/>
            </div>
        } else if (value.type === 'numeric') {
            return <div key={value.label}
                        className={'Cell Numeric'}>
                {this.props.value[value.id]}
            </div>
        } else {
            return <div key={value.label}
                        className={'Cell'}>
                {this.props.value[value.id]}
            </div>
        }

    }

    list() {
        return this.props.columns.map((value, index1) => {
            return this.cell(value)
        })
    }

    render(): React.ReactNode {
        return <div className={'Raw'} onClick={event1 => {
            if (this.props.onRowClick) this.props.onRowClick(this.props.value, this.props.index);
        }} style={{top: `${this.props.top}px`}}>
            <div className={'Check-Box'}>
                <div className={'Button'} onClick={this.onSelected}>
                    {this.props.value.isSelected && <div className={'Surface'}/>}
                </div>
            </div>
            {this.list()}
        </div>;
    }
}