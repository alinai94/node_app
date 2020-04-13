const express = require("express")
const exphbs = require("express-handlebars")
const mongoose = require("mongoose")
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash")
const methodOverride = require("method-override")
const bcrypt = require("bcrypt")
const app = express()
const http = require("http").createServer(app)

const ideas = require("./routes/ideas")
const users = require("./routes/users")

// Connect to mongoose
mongoose
	.connect("mongodb://localhost/node-app")
	.then(() => {
		console.log("Mongodb connected....")
	})
	.catch(err => {
		console.log("connection error:", err)
	})

app.engine(
	"handlebars",
	exphbs({
		defaultLayout: "main"
	})
)
app.set("view engine", "handlebars")

// 使用静态文件
app.use(express.static(path.join(__dirname, "public")))
//method-overridez=中间件
app.use(methodOverride("_method"))

app.use(
	session({
		secret: "secret",
		resave: true,
		saveUninitialized: true
	})
)

app.use(flash())

// 配置全局变量
app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg")
	res.locals.error_msg = req.flash("error_msg")
	next()
})

app.get("/", (req, res) => {
	const title = "你好啊，我是晓洪"
	res.render("index", {
		title: title
	})
})
app.get("/about", (req, res) => {
	res.render("about")
})

// 使用routes
app.use("/ideas", ideas)
app.use("/users", users)

http.listen(3000, function() {
	console.log("Server is listening at: localhost:3000")
})
