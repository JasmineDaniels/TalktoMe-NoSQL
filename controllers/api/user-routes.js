const router = require('express').Router();
const { User, Thoughts,  }  = require('../../models')
//api/users

// Get All users
router.get('/', async (req, res) => {
    try {
        const userData = await User.find({}).populate("friends")
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

        //if user is deleted, delete users thoughts
        await Thoughts.deleteMany({user_id: req.params._id})
    
        !userData ? res.status(404).json({
            message: `No users with this id..`
        }) : res.json({ message: `User ${req.params._id} has been deleted.`})
    } catch (error) {
        res.status(500).json(error)
    }
})

//Create a friend
router.post('/:myId/friends/:user_id', async (req, res) => {
    try {
        // const friend = req.body; // the friends user_id 
        const updateUser = await User.findOneAndUpdate(
            {_id: req.params.myId},
            {$addToSet: {friends: req.params.user_id}},
            {runValidators: true, returnOriginal: false}
        ).populate('friends');

        if(!updateUser){
            res.status(404).json({ message: `No user associated with this thought`})
        } res.json(updateUser)
    } catch (error) {
        res.status(500).json(error)
    }
});

//Delete a friend
router.delete('/:myId/friends/:user_id', async (req, res) => { 
    try {
        //const friend = req.body; 
        const updateUser = await User.findByIdAndUpdate( 
            {_id: req.params.myId}, //find user
            {$pull: {friends: req.params.user_id}}, //update friends
            {returnOriginal: false} //return
        )

        !updateUser  
        ? res.status(404).json({ message: 'No friend with this id'})
        : res.json({ message: `Friend ID no. ${req.params.user_id}, has been deleted.`})
    } catch (error) {
        res.status(500).json(error)

    }
})

module.exports = router;