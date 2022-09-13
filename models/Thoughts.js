const { model, Schema } = require("mongoose");
const Reaction = require('./Reaction')

const thoughtSchema = new Schema(
    {
        content: { 
            type: String,
            minLength: 10,
            maxLength: 400,
            required: true,
        },
        meta: {
            likes: Number,
            bookmarks: Number,
        },
        reactions: [Reaction],
        // reactions: [
        //     {
        //         type: Schema.Types.ObjectId,
        //         ref: 'reaction',
        //     },
        // ],

    },
    {
        timestamps: true
    },
    {
        toJSON: {
        virtuals: true,
        },
        id: false
    },  
)

thoughtSchema
    .virtual('reactionsCount')
    .get(function () {
        return this.reactions.length;
    })
    // .set(function (v){
    //     this.set({v})
    // })


const Thoughts = model('thoughts', thoughtSchema)

module.exports = Thoughts;
