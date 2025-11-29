let { PrismaClient } = require("@prisma/client");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let app = express();
app.use(express.json());
let prisma = new PrismaClient();

app.use("/allotment" , require("./allotment-module/allotmentRoutes"));

app.post("/signup", async (req, res) => {
  let name = req.body.user;
  let email = req.body.email;
  let password = req.body.password;
  if (name && email && password) {
    let a = await prisma.user.findFirst({
      where: {
        OR: [{ name: name }, { email: email }],
      },
    });
    if (a) {
      res.status(400).send("this user already exists");
    } else {
      let b = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: await bcrypt.hash(password, 10),
        },
      });
      res.status(200).json(b);
    }
  } else {
    res.status(400).send("we need everything for details");
  }
});

app.post('/login', async(req, res) => {
    let name = req.body.name
    let email = req.body.email
    let password = req.body.password 
    if ((name && password) || (email && password)){
        let user = await prisma.user.findFirst({
            where : {
                OR : [
                    {name : name},
                    {email : email}
                ]
            }
        })

        if (!user){
            res.status(400).json({message : "Signup First!"})
        }
        else{
            let validate = await bcrypt.compare(password, user.password)
            if (validate){
                let token = jwt.sign({name : user.name, role : user.role}, "Rps@220068", {expiresIn : "5h"})
                res.status(200).json({"token" : token})
            }
            else{
                res.status(400).json({message : "Invalid Password"})
            }
        }
    }else {
        res.status(400).json({message : "All Fields Required!"})
    }
})
