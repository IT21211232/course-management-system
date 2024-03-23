const Resource = require('../models/Resource');

async function addResource(req, res, next){
    if(req.user.role === 'admin'){
        const name = req.body.name;
        const description = req.body.description;
        try {
            const resourceItem = new Resource({
                name,
                description
            });
    
            await resourceItem.save();
            return res.json({ status: "Resource successfully added!" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ status: "Error with adding resource" });
        }
    }
    else{
        return res.status(401).json({ error: "You are not authorized to add resources" });
    }
}

module.exports = { addResource };