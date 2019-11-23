import * as React from "react";
import {CELL_HEIGHT, DatatableProps} from "./index";
import {Raw} from "./raw";

interface Props extends DatatableProps {
    selectedIndex: number[]
}

interface State {
    visibleItem: {
        start: number,
        end: number
    }
}

export class Holder extends React.Component<Props, State> {
    state: State = {
        visibleItem: {
            start: 0,
            end: 200
        }
    };

    constructor(props: Props) {
        super(props);
    }

    data() {
        const columns = this.props.columns;
        const rows = this.props.rows;
        if (rows) {
            const visibleItem = this.state.visibleItem;
            const list = [];
            const end = rows.length - 1 < this.state.visibleItem.end ? rows.length : this.state.visibleItem.end;
            for (let index = visibleItem.start; index < end; index++) {
                const rowValue = rows[index];
                const rawTop = index * CELL_HEIGHT;
                list.push(<Raw selectedIndex={this.props.selectedIndex}
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