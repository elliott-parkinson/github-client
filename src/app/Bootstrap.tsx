import * as React from "react";
import * as ReactDOM from "react-dom";

import { View } from "./views";

window.onload = () => {
    let element: any = document.getElementById("app");
    ReactDOM.render( <View />, element );
}
