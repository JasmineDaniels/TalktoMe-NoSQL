const router = require('express').Router();
const { Thoughts, User } = require('../../models')

//GET All Thoughts
router.get('/', (req, res) => {
    Thoughts.find().populate('reactions')
    .then((x) => res.json(x))
    .catch((error) => res.status(500).json(error));
});

//Get one thought
router.get('/:_id', (req, res) => {
    Thoughts.findById({ _id: req.params._id}).populate('reactions')
    .then((thought) => {
        !thought 
            ? res.status(404).json({ message: `Opps no thought with this id`})
            : res.json(thought)
    })
    .catch((error) => res.status(500).json(error))
})

//Create a new Thought 
router.post('/', async (req, res) =>{
    try {
        
        const newThought = await Thoughts.create(req.body)
        const updateUser = await User.findOneAndUpdate(
            //{username: req.body.username},
            {_id: req.body.user_id},
            //add new thought id to the array of thoughts
            {$addToSet: {thoughts: newThought}}, // $push
            {runValidators: true, returnOriginal: false}
        ).populate('thoughts')
        
        if(!updateUser){
            res.status(404).json({ message: `No user associated with this id`})
            return
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

//Post a reaction
router.post('/:thought_id/reactions', async (req, res) => {
    try {
        const updateThought = await Thoughts.findOneAndUpdate(
            {_id: req.params.thought_id},
            {$addToSet: {reactions: req.body}}, //commentor id + comment
            {runValidators: true, returnOriginal: false}
        )

        !updateThought 
            ? res.status(404).json({ message: `No reaction no. ${req.body.reactionId} associated with this thought.`}) 
            : res.json(updateThought)
    } catch (error) {
        res.status(500).json(error)
    }
})

// router.put('/:thought_id', async (req, res) => {
//     try {
//         const update = req.body;
//         const reaction = await Thoughts.findByIdAndUpdate(
//             {_id: req.params._id}, //find thought
//             {$set: {reactions: {}}},
//             {runValidators: true, returnOriginal: false} // {new: true}
//         )
//         if(!reaction){
//             res.status(404).json("This reaction doesn't exist.")
//         }   
//         res.json({ message: `Reaction ${req.params._id} has been updated.`, reaction})
//     } catch (error) {
//         res.status(500).json(error)
//     }
// });


router.delete('/:thought_id/reactions', async (req, res) => {
    try {
        const updateThoughts = await Thoughts.findOneAndUpdate(
            {_id: req.params.thought_id},
            // pull the id from the array of reactions
            {$pull: {reactions: {_id: req.body.reaction_id}}},
            {returnOriginal: false}
        )

        !updateThoughts  
        ? res.status(404).json({message: `No reaction with this id`})
        : res.json({ message: `Reaction ${req.body.reaction_id} has been deleted.`})
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;

