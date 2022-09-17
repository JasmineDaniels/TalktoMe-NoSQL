const { model, Schema, Types } = require("mongoose");
const Reaction = require('./Reaction')

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

// thoughtSchema.virtual('popUsername', {
//     ref: 'user',
//     localField: 'username',
//     foreignField: '_id'
// });

const Thoughts = model('thoughts', thoughtSchema)

module.exports = Thoughts;
