const express = require("express")
const router = express.Router()
const db = require("../db")
const ExpressError = require("../expressError")



router.get("/", async(req,res,next) => {
    try{
        const results = await db.query('SELECT * FROM companies')
        return res.json({companies: results.rows})
    }catch(e){
        return next(e)
    }
})

router.get("/:code", async(req,res,next) => {
    try{
        const {code} = req.params
        const results = await db.query('SELECT * FROM companies WHERE code=$1', [code])
        if(results.rows.length === 0){
            throw new ExpressError(`company with the code of ${code} does not exist`, 404)
        }
        return res.json({company: results.rows[0]})
    }catch(e){
        return next(e)
    }
})

router.post("/", async(req,res,next) => {
    try{
        const {code,name,description} = req.body
        const results = await db.query('INSERT INTO companies (code,name,description) VALUES($1,$2,$3) RETURNING *', [code,name,description])
        return res.status(201).json({company: results.rows[0]})
    }catch(e){
        next(e)
    }
})

router.patch("/:code", async(req,res,next) => {
    try{
        const {code} = req.params;
        const {name,description} = req.body
        const results = await db.query('UPDATE companies SET name=$1,description=$2 WHERE code=$3 RETURNING *', [name,description,code])
        if(results.rows.length === 0){
            throw new ExpressError(`company with the code of ${code} was not found`, 404)
        }
        return res.send({company: results.rows[0]})
    }catch(e){
        next(e)
    }
  
})

router.delete("/:code", async(req,res,next) => {
    try{
        const results = await db.query('DELETE FROM companies WHERE code=$1', [req.params.code])
        return res.send({msg: "DELETED!"})
    }catch(e){
        next(e)
    }
})






module.exports = router