import * as React from "react";
import {CELL_HEIGHT, Column, DatatableProps, Row} from "./index";

interface Props {
    columns: Column[],
    top: number,
    value: Row
}

export class Raw extends React.Component<Props, any> {

    constructor(props: Props) {
        super(props);
    }

    onSelected = () => {
        if (this.props.value.isSelected) {
            delete this.props.value.isSelected
        } else {
            this.props.value.isSelected = true
        }
        this.setState({});
    };

    render(): React.ReactNode {
        return <div className={'Raw'} style={{top: `${this.props.top}px`}}>
            <div className={'Check-Box'}>
                <div className={'Button'} onClick={this.onSelected}>
                    {this.props.value.isSelected && <div className={'Surface'}/>}
                </div>
            </div>
            {this.props.columns.map((value, index1) => {
                return <div key={value.label}
                            className={(value.type ? value.type : 'Cell')}>
                    {value.type === 'thumb' &&
                    <div style={{backgroundImage: `url(${this.props.value[value.id]})`}} className={'image'}/>}
                    {value.type ? '' : this.props.value[value.id]}
                </div>
            })}
        </div>;
    }
}