const { model, Schema, Types } = require("mongoose");
const Reaction = require('./Reaction')
//const moment = require('moment')

function getUsername(_id){
    return this._id.username;
}


const thoughtSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        content: { 
            type: String,
            minLength: 10,
            maxLength: 400,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            get: (date) => {
                // let dateStr = new Date(date).toDateString()
                let newdate = new Date().toDateString()
                return newdate
            }
        },
        reactions: [Reaction],   
    },
    {
        toJSON: {
        virtuals: true,
        getters: true,
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
