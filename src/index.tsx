import './index.scss';
import './lib/index.scss';
import {render} from 'react-dom'
import React = require("react");
import {App} from "./app";
import "./settings.scss";

window.oncontextmenu = (e: MouseEvent) => {
    return e.target instanceof HTMLInputElement && e.target.type == 'text';
};

const appElm = document.createElement('div');
appElm.classList.add('Container');
document.body.appendChild(appElm);

window.onload = () => {
    render(
        <App/>,
        appElm
    );
};
