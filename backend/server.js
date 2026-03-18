const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("./database.db");

/* ---------- CREATE TABLES ---------- */

db.run(`
CREATE TABLE IF NOT EXISTS projects (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS records (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 project_id INTEGER,
 key_string TEXT,
 value_int INTEGER,
 UNIQUE(project_id,key_string)
)
`);

/* ---------- PROJECT APIs ---------- */

// create project
app.post("/projects",(req,res)=>{
 const {name} = req.body;

 db.run(
  "INSERT INTO projects(name) VALUES(?)",
  [name],
  function(err){
   if(err) return res.send(err);
   res.json({id:this.lastID});
  }
 );
});

// list projects
app.get("/projects",(req,res)=>{
 db.all("SELECT * FROM projects",(err,rows)=>{
  res.json(rows);
 });
});

// delete project
app.delete("/projects/:id",(req,res)=>{
 db.run(
  "DELETE FROM projects WHERE id=?",
  [req.params.id],
  ()=>{
   res.json({status:"deleted"});
  }
 );
});

/* ---------- KEY VALUE APIs ---------- */

// get value of key
app.get("/projects/:projectId/value/:key",(req,res)=>{

 db.get(
  `SELECT value_int FROM records
   WHERE project_id=? AND key_string=?`,
  [req.params.projectId,req.params.key],
  (err,row)=>{

   if(!row) return res.json({value:0});

   res.json({value:row.value_int});
  }
 );
});

// create or update key
app.post("/projects/:projectId/value",(req,res)=>{

 const {key,value} = req.body;

 db.run(
  `INSERT INTO records(project_id,key_string,value_int)
   VALUES(?,?,?)
   ON CONFLICT(project_id,key_string)
   DO UPDATE SET value_int=?`,
  [req.params.projectId,key,value,value],
  ()=>{
   res.json({status:"saved"});
  }
 );
});

// get table sorted
app.get("/projects/:projectId/table",(req,res)=>{

 db.all(
  `SELECT key_string,value_int
   FROM records
   WHERE project_id=?
   ORDER BY value_int DESC`,
  [req.params.projectId],
  (err,rows)=>{
   res.json(rows);
  }
 );

});

app.listen(3000,()=>{
 console.log("Server running on port 3000");
});