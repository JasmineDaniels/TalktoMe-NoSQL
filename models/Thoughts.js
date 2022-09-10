const { model, Schema } = require("mongoose");

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
        reactions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'reactions',
            },
        ],

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
