const router = require('express').Router();
const { User } = require('../../models')

//Get all friends
// router.get('/', (req, res) => {
//     Friend.find().populate('user_id')
//     .then((x) => res.json(x))
//     .catch((error) => res.status(500).json(error));
// })

//Get friend by id
// router.get('/:_id', async (req, res) => {
//     Friend.findById({_id: req.params._id}).populate('user_id')
//     .then((friend) => {
//         !friend 
//         ? res.status(404).json({ message: `Sorry no friends with this id.`})
//         : res.json(friend)
//     })
//     .catch((error) => res.status(500).json(error))

// })

//create a friend

router.post('/:myId', async (req, res) => {
    try {
        const friend = req.body; // the friends user_id 
        const updateUser = await User.findOneAndUpdate(
            {_id: req.params.myId},
            {$addToSet: {friends: friend.user_id}},
            {runValidators: true, returnOriginal: false}
        ).populate('friends');

        if(!updateUser){
            res.status(404).json({ message: `No user associated with this thought`})
        } res.json(updateUser)
    } catch (error) {
        res.status(500).json(error)
    }
});

router.delete('/:myId', async (req, res) => { 
    try {
        const friend = req.body; 
        const updateUser = await User.findByIdAndUpdate( 
            {_id: req.params.myId}, //find user
            {$pull: {friends: friend.user_id}}, //update friends
            {returnOriginal: false} //return
        )

        !updateUser  
        ? res.status(404).json({ message: 'No friend with this id'})
        : res.json({ message: `Friend ID no. ${req.body.user_id}, has been deleted.`})
    } catch (error) {
        res.status(500).json(error)

    }
})

module.exports = router;