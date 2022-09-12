const router = require('express').Router();
const { Friend, User } = require('../../models')


router.get('/', async (req, res) => {
    Friend.find().populate('user_id')
    .then((x) => res.json(x))
    .catch((error) => res.status(500).json(error));
})

//create a friend
router.post('/:myId', async (req, res) => {
    try {
        const friend = req.body; // the friends user_id 
        const createFriend = await Friend.create(friend) //friend_id
        const friendName = await User.findOne({ _id: friend.user_id})
        const updateUser = await User.findOneAndUpdate(
            {_id: req.params.myId},
            // {$addToSet: {friends: createFriend._id}},
            {$addToSet: {friends: `${friendName.first} ${friendName.last}`}},
            {returnOriginal: true}
        ).populate('friends');

        if(!updateUser){
            res.status(404).json({ message: `No user associated with this thought`})
        }   
        res.json(updateUser)
        //res.json(friendName)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;