const { model, Schema } = require("mongoose");

const reactionSchema = new Schema(
    {
        comment: { 
            type: String,
            minLength: 10,
            maxLength: 400,
            required: true,
        },
        meta: {
            likes: Number,
            bookmarks: Number,
        },  
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

reactionSchema
  .virtual('likesCount')
  .get(function () {
    return this.meta.likes;
  });
    


const Reaction = model('reaction', reactionSchema)

module.exports = Reaction;
