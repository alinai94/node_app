const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const router = express.Router()

// import schema
require("../models/Idea")
const Idea = mongoose.model("ideas")

// 中间件
var jsonParser = bodyParser.json()
var urlencodeParser = bodyParser.urlencoded({extend: false})

// 获取课程
router.get("/", (req, res) => {
	Idea.find()
		.sort({
			date: "desc"
		})
		.then(ideas => {
			ideas = ideas.map(item => {
				return {
					title: item.title,
					details: item.details,
					id: item._id
				}
			})
			res.render("ideas/index", {
				ideas: ideas
			})
		})
})
// 获取课程
router.get("/get", (req, res) => {
	Idea.find()
		.sort({
			date: "desc"
		})
		.then(ideas => {
			ideas = ideas.map(item => {
				return {
					title: item.title,
					details: item.details,
					id: item._id
				}
			})
			console.log("ideas: \n", ideas)
			res.send(ideas)
		})
})

// 实现删除
router.delete("/:id", (req, res) => {
	Idea.remove({
		_id: req.params.id
	}).then(() => {
		req.flash("success_msg", "数据删除成功")
		res.redirect("/ideas")
	})
})

// 添加数据
router.post("/", urlencodeParser, (req, res) => {
	let errors = []
	if (!req.body.title) {
		errors.push({
			text: "请输入标题"
		})
	}
	if (!req.body.details) {
		errors.push({
			text: "请输入详情"
		})
	}
	if (errors.length > 0) {
		res.render("ideas/add", {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		})
	} else {
		const newUser = {
			title: req.body.title,
			details: req.body.details
		}
		console.log("newUser: ", newUser)
		new Idea(newUser)
			.save()
			.then(idea => {
				req.flash("success_msg", "数据添加成功")
				res.redirect("/ideas")
			})
			.catch(err => {
				console.log("err: ", err)
			})
		// res.send("ok")
	}
})
router.get("/add", (req, res) => {
	res.render("ideas/add")
})

// 修改数据
router.get("/edit/:id", (req, res) => {
	Idea.findOne({
		_id: req.params.id
	}).then(idea => {
		console.log("idea:", idea)
		res.render("ideas/edit", {
			title: idea.title,
			details: idea.details,
			id: idea._id
		})
	})
})
router.put("/:id", urlencodeParser, (req, res) => {
	Idea.findOne({
		_id: req.params.id
	}).then(idea => {
		idea.title = req.body.title
		idea.details = req.body.details

		idea.save().then(idea => {
			req.flash("success_msg", "数据修改成功")
			res.redirect("/ideas")
		})
	})
})

module.exports = router
