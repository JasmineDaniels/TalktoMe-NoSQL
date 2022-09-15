const router = require('express').Router();
const { Thoughts } = require('../../models');

//  api/reactions endpoint

//Get All reactions
// router.get('/', async (req, res) => {
//     try {
//         const reactData = await Reaction.find();
//         reactData ? res.json(reactData) 
//         : res.status(404).json({ message: `No reactions..`})
//     } catch (error) {
//         res.status(500).json(error)
//     } 
// });

//Get a reaction
// router.get('/:_id', async (req, res) => {
//     try {
//         const reaction = await Reaction.findById({ _id: req.params._id})
//         !reaction 
//             ? res.status(404).json({ message: `Opps no reactions with this id.`})
//             : res.json(reaction)
//     } catch (error) {
//         res.status(500).json(error)
//     }
// });

router.post('/:thought_id', async (req, res) => {
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


router.delete('/:thought_id', async (req, res) => {
    // const reaction = await Reaction.findByIdAndDelete({_id: req.params._id})
    // if (!reaction) {res.status(404).json({ message: `No reaction with this id.`})}
    try {
        const updateThoughts = await Thoughts.findOneAndUpdate(
            // {reactions: req.params._id},
            {_id: req.params.thought_id},
            // pull the id from the array of reactions
            {$pull: {reactions: {_id: req.body._id}}},
            {returnOriginal: false}
        )

        !updateThoughts  
        ? res.status(404).json({message: `No reaction with this id`})
        : res.json({ message: `Reaction ${req.body._id} has been deleted.`})
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router;