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

    render(): React.ReactNode {
        return <div className={'Raw'} style={{top: `${this.props.top}px`}}>
            {this.props.columns.map((value1, index1) => {
                return <div key={value1.label} className={'Cell'}>{this.props.value[value1.id]}</div>
            })}
        </div>;
    }
}