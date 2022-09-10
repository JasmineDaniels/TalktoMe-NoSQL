const router = require('express').Router();
const { Reaction, Thoughts } = require('../../models');

//  api/reactions endpoint

//Get All reactions
router.get('/', async (req, res) => {
    try {
        const reactData = await Reaction.find();
        reactData ? res.json(reactData) 
        : res.status(404).json({ message: `No reactions..`})
    } catch (error) {
        res.status(500).json(error)
    } 
});

router.post('/:thought_id', async (req, res) => {
    try {
        const reaction = req.body;
        const newReaction = await Reaction.create(reaction)
        const updateThought = await Thoughts.findOneAndUpdate(
            {_id: req.params.thought_id},
            {$addToSet: {reactions: newReaction._id}}, 
            {runValidators: true, returnOriginal: false}
        ).populate('reactions')

        !updateThought 
            ? res.status(404).json({ message: `No thought associated with this reaction`}) 
            : res.json(updateThought)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.put('/:_id', async (req, res) => {
    try {
        const update = req.body;
        const reaction = await Reaction.findByIdAndUpdate(
            {_id: req.params._id},
            {$set: update},
            {runValidators: true, returnOriginal: false} // {new: true}
        )
        if(!reaction){
            res.status(404).json("This reaction doesn't exist.")
        }   
        res.json({ message: `Reaction ${req.params._id} has been updated.`, reaction})
    } catch (error) {
        res.status(500).json(error)
    }
});

router.delete('/:_id', async (req, res) => {
    const reaction = await Reaction.findByIdAndDelete({_id: req.params._id})
    if (!reaction) {res.status(404).json({ message: `No reaction with this id.`})}
    const updateThoughts = await Thoughts.findOneAndUpdate(
        {reactions: req.params._id},
        // pull the id from the array of reactions
        {$pull: {reactions: {_id: req.params._id}}},
        {returnOriginal: false}
    )
    
    !updateThoughts  
    ? res.status(500).json({ message: 'Reaction was deleted, but was not assigned to a thought..'})
    : res.json({ message: `Reaction ${req.params._id} has been deleted.`})
})

module.exports = router;