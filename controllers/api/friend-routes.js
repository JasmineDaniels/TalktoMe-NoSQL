const router = require('express').Router();
const { Friend, User } = require('../../models')


router.get('/', (req, res) => {
    Friend.find().populate('user_id')
    .then((x) => res.json(x))
    .catch((error) => res.status(500).json(error));
})

//Get friend by id
router.get('/:_id', async (req, res) => {
    Friend.findById({_id: req.params._id}).populate('user_id')
    .then((friend) => {
        !friend 
        ? res.status(404).json({ message: `Sorry no friends with this id.`})
        : res.json(friend)
    })
    .catch((error) => res.status(500).json(error))

})

//create a friend
router.post('/:myId', async (req, res) => {
    try {
        const friend = req.body; // the friends user_id 
        const createFriend = await Friend.create(friend) //friend_id
        const updateUser = await User.findOneAndUpdate(
            {_id: req.params.myId},
            {$addToSet: {friends: createFriend._id}},
            {runValidators: true, returnOriginal: false}
        ).populate('friends');

        if(!updateUser){
            res.status(404).json({ message: `No user associated with this thought`})
        } res.json(updateUser)
    } catch (error) {
        res.status(500).json(error)
    }
});

router.delete('/:_id', async (req, res) => { //user_id
    const friend = req.body; //friend_id
    const deleteFriend = await Friend.findByIdAndDelete({_id: req.body.friend_id})
    if (!deleteFriend) {res.status(404).json({ message: `Cannot find a friend with this id`})}
    const updateUser = await User.findByIdAndUpdate( //findOneAndUpdate?
        {_id: req.params._id}, //find user
        {$pull: {friends: req.body.friend_id}}, //update friends
        {returnOriginal: false} //return
    )

    !updateUser  
    ? res.status(500).json({ message: 'Friend was deleted, but was not assigned to a user..'})
    : res.json({ message: `Friend ID no. ${req.body.friend_id}, has been deleted.`})
})

module.exports = router;