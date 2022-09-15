const { model, Schema, Types } = require("mongoose");
const Reaction = require('./Reaction')
//const moment = require('moment')


const thoughtSchema = new Schema(
    {
        content: { 
            type: String,
            minLength: 10,
            maxLength: 400,
            required: true,
        },
        createdAt: {
            type: String,
            default: Date,
        },
        reactions: [Reaction],   
    },
    {
        toJSON: {
        virtuals: true,
        },
        id: false
    },  
)

thoughtSchema.virtual('reactionsCount')
    .get(function () {
        return this.reactions.length;
    })


const Thoughts = model('thoughts', thoughtSchema)

module.exports = Thoughts;
