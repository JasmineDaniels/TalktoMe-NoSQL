const { Schema, Types } = require("mongoose");

const reactionSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            default: () => Types.ObjectId(),
        },
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
        getters: true,
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
    


// const Reaction = model('reaction', reactionSchema)

module.exports = reactionSchema;
