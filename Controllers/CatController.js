const Cat = require("../Models/CatModel");

module.exports = {
    index: (req, res) => {
        Cat.find({}).then(cats => res.json(cats)).catch(err => res.json(`There an error ${err}`))
    },
    create: (req, res) => {
        const kitty = new Cat({ name: req.body.name });
        kitty.save().then(cats => Cat.find({})).then(cats => res.json(cats)).catch(err => res.json(`There an error ${err}`));
    },
    update: (req, res) => {
        Cat.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true }).then(cats => res.json(cats)).catch(err => res.json(`There an error ${err}`));
    },
    delete: (req, res) => {
        Cat.findByIdAndDelete(req.params.id).then(cats => Cat.find({})).then(cats => res.json(cats)).catch(err => res.json(`There an error ${err}`));
    }
}