const { Router } = require("express");
const routerUsers = Router();
const {Users, Recipe} = require ("../db")


routerUsers.post("/", async (req, res) => {
    const { name, email, email_verified, status } = req.body
    try {
        const search = await Users.findOne({ where: { email: email } });
        if (!search) {
            const user = Users.create({
                email,
                name,
                email_verified,
                status,
            });

            let recipeDb = await Recipe.findAll({
                where: {
                    name: nameRecipe
                }
            });
            newUser.addRecipe(recipeDb);
            return res.status(201).send("Usuario creado con exito");
        } else {
            res.send("Este usuario ya existe")
        }
    } catch (error) {
        return res.send("Errior al momento de crear")  
    }
})

routerUsers.get("/", async (req, res) => {
    let allUser = await Users.findAll({
        include: {
            model: Recipe,
            through: {attributes: []}
        }
    })
    return res.json(allUser)
})

routerUsers.get("/:email", async (req, res) => {
    let { email } = req.params;
    try {
        let getUser = await Users.findOne({
            where: { email: email },
            include: {
                model: Recipe,
                through: { attributes: [] },
            }
        });
        return res.json(getUser);
    } catch (error) {
        res.json("No se pudo obtener este usuario")
    }
});



module.exports = routerUsers;
