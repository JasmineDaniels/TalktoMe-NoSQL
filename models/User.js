const { model, Schema } = require("mongoose");


function validateEmail(email){
    const re = /^([a-z0-9A-Z\d\.-_]+)@([a-z\d-]+)\.([a-z]{2,6})?$/
    return re.test(email)
}

const userSchema = new Schema(
    {
        first: String,
        last: String,
        username: {
            type: String, 
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            validate: [validateEmail, 'Please fill in a valid email address'],
            //match: [/ @ /, 'Please fill in a valid email address']
            
        },
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user',
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

userSchema.virtual('friendCount')
    .get(function () {
        return this.friends.length;
    })

// userSchema.virtual('fullName')
//     .get(function (){
//         return `${this.first} ${this.last}`;
//     })
//     .set(function (v){
//         const first = v.split('')[0];
//         const last = v.split('')[1];
//         this.set({ first, last });
//     })

const User = model('user', userSchema)

module.exports = User;
