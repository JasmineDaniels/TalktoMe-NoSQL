const { Schema, Types } = require("mongoose");

const reactionSchema = new Schema(
    {
        reaction_id: { //auto generated
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        comment: { 
            type: String,
            minLength: 10,
            maxLength: 400,
            required: true,
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: String,
            // default: Date,
            get: (date) => {
                
                let newdate = new Date().toDateString()
                return newdate
            }
        },
        meta: {
            likes: Number,
            bookmarks: Number,
        },  
    },
    {
        toJSON: {
        getters: true,
        virtuals: true,
        },
        id: false
    },  
)

// const Reaction = model('reaction', reactionSchema)
module.exports = reactionSchema;
