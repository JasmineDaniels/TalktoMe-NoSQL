const { Schema, model, Types } = require("mongoose");

// friendId: {
//     type: Schema.Types.ObjectId,
//     default: () => Types.ObjectId(),
// },
const friendSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        
        
    },

)

const Friend = model('friend', friendSchema)

module.exports = Friend;