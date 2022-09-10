const { model, Schema } = require("mongoose");

const userSchema = new Schema(
    {
        first: String,
        last: String,
        username: {type: String, required: true},
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'friend',
            },
        ],
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thoughts',
            },
        ],     

    },
    {
        toJSON: {
        virtuals: true,
        },
        id: false
    },
)

userSchema.virtual('fullName')
    .get(function (){
        return `${this.first} ${this.last}`;
    })
    .set(function (v){
        const first = v.split('')[0];
        const last = v.split('')[1];
        this.set({ first, last });
    })

const User = model('user', userSchema)

module.exports = User;
