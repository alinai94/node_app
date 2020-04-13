const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt")

const router = express.Router()
console.log("bcrypt:", bcrypt)
// 中间件
var jsonParser = bodyParser.json()
var urlencodeParser = bodyParser.urlencoded({extend: false})

// 加载model
require("../models/User")
const User = mongoose.model("users")

router.get("/login", (req, res) => {
	res.render("users/login")
})

router.get("/register", (req, res) => {
	res.render("users/register")
})

router.post("/register", urlencodeParser, (req, res) => {
	console.log("/register", req.body)
	let errors = []
	if (req.body.password !== req.body.password2) {
		errors.push({
			text: "两次的密码不一致！"
		})
	} else if (req.body.password.length < 4) {
		errors.push({
			text: "密码长度不能小于4位！"
		})
	}
	console.log("errors: ", errors)
	if (errors.length > 0) {
		res.render("users/register", {
			errors: errors,
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			password2: req.body.password2
		})
	} else {
		const newUser = new User({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		})

		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if (err) throw err
				newUser.password = hash
				console.log("password: ", hash)
				User.findOne({
					email: req.body.email
				}).then(usr => {
					if (usr) {
						req.flash("error_msg", "邮箱已被注册，请更换油箱")
						res.redirect("users/register")
					} else {
						newUser
							.save()
							.then(() => {
								req.flash("success_msg", "注册成功！")
								res.redirect("/users/login")
							})
							.catch(err => {
								console.log(err)
								req.flash("error_msg", "注册失败！")
								res.redirect("users/register")
							})
					}
				})
			})
		})
	}
})

module.exports = router
