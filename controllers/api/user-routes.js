const router = require('express').Router();
const { User,  }  = require('../../models')
//api/users

// Get All users
router.get('/', async (req, res) => {
    try {
        const userData = await User.find({})
        res.json(userData);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Get a user
router.get('/:_id', (req, res) => {
    User.findById({ _id: req.params._id }).populate('thoughts').populate('friends')
    .then((user) => 
        !user 
            ? res.status(404).json({message: `Opps no user by this id`})
            : res.json(user)
    )
    .catch((error) => res.status(500).json(error))
})

//Update a user
router.put('/:_id', async (req, res) => {
    try {
        const update = req.body;
        const userData = await User.findOneAndUpdate(
            {_id: req.params._id},
            {$set: update},
            {returnOriginal: false}
        )
        if(!userData){
            res.status(404).json("This user doesn't exist.")
        }   
        res.json({ message: `User ${req.params._id} has been updated.`, userData})
        
    } catch (error) {
        res.status(500).json({ message: `Uh Oh! Something went wrong`})
    }
})

//Create a user
router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);
        //const newUser = await userData.save()

        res.json(userData);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Delete a user
router.delete('/:_id', async (req, res) => {
    try {
        const userData = await User.findOneAndDelete({
            _id: req.params._id
        })
    
        !userData ? res.status(404).json({
            message: `No users with this id..`
        }) : res.json({ message: `User ${req.params._id} has been deleted.`})
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;