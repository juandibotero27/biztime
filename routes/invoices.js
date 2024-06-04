const express = require("express")
const router = express.Router()
const db = require("../db")
const ExpressError = require("../expressError")

router.get("/", async(req,res,next) => {
    try{
        const results = await db.query('SELECT * FROM invoices')
        return res.json({invoices: results.rows})
    }catch(e){
        return next(e)
    }
})

router.get("/:id", async(req,res,next) => {
    try{
        const {id} = req.params
        const results = await db.query('SELECT * FROM invoices WHERE id=$1', [id])
        if(results.rows.length === 0){
            throw new ExpressError(`invoice with the id of ${id} cannot be found`, 404)
        }
        return res.json({invoice: results.rows[0]})
    }catch(e){
         return next(e)
    }
})

router.post("/", async(req,res,next) => {
    try{
        const {comp_code, amt} = req.body
        const results = await db.query('INSERT INTO invoices (comp_code,amt) VALUES ($1,$2) RETURNING *', [comp_code, amt])
        return res.status(201).json({invoice: results.rows[0]})
    }catch(e){
       return next(e) 
    }
})

router.patch("/:id", async(req,res,next) => {
    try{
        const {amt} = req.body
        const results = await db.query('UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING *', [amt,req.params.id])
        if(results.rows.length === 0){
            throw new ExpressError(`invoice with the id of ${req.params.id} cannot be found in database`, 404)
        }
        return res.json({invoice: results.rows[0]})
    }catch(e){
        return next(e)
    }
})

router.delete("/:id", async(req,res,next) => {
    try{
        const results = await db.query('DELETE FROM invoices WHERE id=$1', [req.params.id])
        return res.json({msg: "DELETED!"})
    }catch(e){
        return next(e)
    }
})



module.exports = router