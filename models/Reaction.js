const { Schema, Types } = require("mongoose");

const reactionSchema = new Schema(
    {
        reaction_id: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        comment: { 
            type: String,
            minLength: 10,
            maxLength: 400,
            required: true,
        },
        createdAt: {
            type: String,
            // default: Date,
            get: (date) => {
                // let dateStr = new Date(date).toDateString()
                let newdate = new Date().toDateString()
                return newdate
                // let timestamp = date.toDateDtring()
                // let timestamp = date.toLocaleDateString('en-US', {weekday: 'short', month: 'short', year: 'numeric'})
                // return timestamp
                // let timestamp = new Date(date)
                // return `${timestamp.getMonth()}/${timestamp.getDay}/${timestamp.getFullYear()}`
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
