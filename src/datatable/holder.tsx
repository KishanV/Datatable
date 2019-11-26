import * as React from "react";
import {CELL_HEIGHT, Datatable, DatatableProps} from "./index";
import {Raw} from "./raw";

interface Props extends DatatableProps {
    selectedIndex: number[]
    parent: Datatable,
    visibleItem: {
        start: number,
        end: number
    }
}

// created separate component for each row to optimize render process.
export class Holder extends React.Component<Props, any> {

    constructor(props: Props) {
        super(props);
    }

    // render only ranged data based on visibleItem.
    data() {
        const rows = this.props.rows;
        if (rows) {
            const visibleItem = this.props.visibleItem;
            const list = [];
            const end = rows.length - 1 < this.props.visibleItem.end ? rows.length : this.props.visibleItem.end;
            for (let index = visibleItem.start; index < end; index++) {
                const rowValue = rows[index];
                // calculate top in pixel to render site at place and smooth scrolling.
                const rawTop = index * CELL_HEIGHT;
                // here used key as index because it is unique and it will help to render only new added row.
                list.push(<Raw selectedIndex={this.props.selectedIndex}
                               parent={this.props.parent}
                               index={index}
                               key={index.toString()}
                               value={rowValue}
                               top={rawTop}
                               columns={this.props.columns}
                               onRowClick={this.props.onRowClick}
                               onSelectionChange={this.props.onSelectionChange}
                    />
                )
            }
            return list;
        }
    }

    render(): React.ReactNode {
        return <>
            {this.data()}
        </>;
    }
}