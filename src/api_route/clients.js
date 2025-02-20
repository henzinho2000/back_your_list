const express = require("express");
const pool = require("../db_connection/db.js");
const { celebrate, Joi } = require("celebrate");
const bcrypt = require("bcryptjs");

const route = express.Router();

route.get("/", async (req, res, next)=>{
	try{
		const results = await pool.query('SELECT name, email, thema, language FROM clients');
		res.status(200).json(results.rows);
	}catch(e){
		next(err);
	}
})

route.get(
	"/:id",
	celebrate({
		params: Joi.object({id: Joi.number().integer().required()})
	}),
	async (req, res, next)=>{
		const {id} = req.params;
		const result = await pool.query("SELECT name, email, thema, language FROM clients WHERE id = $1", [id]);
		if(result.rows.length === 0){
			return res.status(404).json({error: `Cliente where id:${id} not found.`});
		}
		res.json(result.rows[0]);
	}
)

route.post(
	"/",
	celebrate({
		body: Joi.object({
			name: Joi.string().max(100).required(),
			password: Joi.string().max(100).required(),
			email: Joi.string().min(3).max(100).required(),
			thema: Joi.required(),
			language: Joi.number().integer().required()
		})
	}),
	async (req, res, next)=>{
		const {name, password, email, thema, language} = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);

		const client = await pool.connect();

		try{
			await client.query("BEGIN");

			const result = await client.query(
				"INSERT INTO clients(name, password, email, thema, language) VALUES($1, $2, $3, $4, $5) RETURNING name, email, thema, language, created_at", 
				[name, hashedPassword, email, thema, language]
			);
			await client.query("COMMIT");
			res.json(result.rows[0]).status(201);
		}
		catch(e){
			await client.query("ROLLBACK");
			res.status(400).json({ error: "Erro ao criar cliente", message: e.message });
		}finally{
			client.release();
		}
	}
)

module.exports = route;
