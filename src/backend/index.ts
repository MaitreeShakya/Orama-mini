import express from "express";
import path from "path";
import bodyparser from "body-parser";
import ejs from "ejs";

const root = "/";
const app = express();

//middleware
app.use(bodyparser.json({ type: "*/*" }));

//ejs setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("html", ejs.renderFile);
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, "./build")));

//ejs serving routes
app.get(`${root}`, function (req, res) {
	res.render("index", { root });
});

const PORT = 5000;
app.listen(PORT);
console.log("App is running at PORT: ", PORT);
