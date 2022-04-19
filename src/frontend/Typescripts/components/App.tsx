import React from "react";
import { Route, Router } from "react-router-dom";
import history from "../utility/history";
import { Landing } from "./Landing";

export const App = () => {
	return (
		<Router history={history}>
			<Route exact path={"/"} component={Landing} />
		</Router>
	);
};
