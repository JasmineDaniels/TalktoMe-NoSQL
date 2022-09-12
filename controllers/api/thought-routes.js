const router = require('express').Router();
const { Thoughts, User } = require('../../models')

//GET All Thoughts
router.get('/', (req, res) => {
    Thoughts.find().populate('reactions')
    .then((x) => res.json(x))
    .catch((error) => res.status(500).json(error));
});

//Get one thought


//Create a new Thought 
router.post('/:user_id', async (req, res) =>{
    try {
        const thought = req.body;
        const newThought = await Thoughts.create(thought)
        const updateUser = await User.findOneAndUpdate(
            {_id: req.params.user_id},
            //add new thought id to the array of thoughts
            {$addToSet: {thoughts: newThought._id}}, // $push
            {runValidators: true, returnOriginal: false}
        ).populate('thoughts');
        
        if(!updateUser){
            res.status(404).json({ message: `No user associated with this thought`})
        }   res.json(updateUser)
    } catch (error) {
        res.status(500).json(error)
    }
})

//Update a thought 
router.put('/:_id', async (req, res) => {
    try {
        const update = req.body
        const thoughtData = await Thoughts.findOneAndUpdate(
            {_id: req.params._id},
            {$set: update},
            {runValidators: true, returnOriginal: false}
        )
        if(!thoughtData){
            res.status(404).json("This thought doesn't exist.")
        }   
        res.json({ message: `Thought ${req.params._id} has been updated.`, thoughtData})
    } catch (error) {
        res.status(500).json(error)
    }
});

//Delete a thought 
router.delete('/:_id', async (req, res) => {
    const thoughtData = await Thoughts.findByIdAndDelete({ _id: req.params._id})
    if (!thoughtData) {res.json({ message: `No thought with this id.`})}
    const updateUser = await User.findOneAndUpdate(
        {thoughts: req.params._id},
        {$pull: {thoughts: req.params._id}},
        {returnOriginal: false}
    )
    
    !updateUser  
    ? res.status(500).json({ message: 'Thought was deleted, but was not assigned to a user..'})
    : res.json({ message: `Thought ${req.params._id} has been deleted.`})
})

module.exports = router;

