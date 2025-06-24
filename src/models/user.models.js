import mongoose , { Schema}from "mongoose";
import bcrypt from "bcrypt"/// for passwords
import jwt from "jsonwebtoken"/// for tokens// it is bearer token

/*
JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact 
and self-contained way for securely transmitting information between parties as a JSON object. 
This information can be verified and trusted because it is digitally signed. JWTs can be signed 
using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA.
*/



/*
users [icon: user] {
  id string pk
  username string
  email string
  fullName string
  avatar string
  coverImage string
  watchHistory ObjectId[] videos
  password string
  refreshToken string
  createdAt Date
  updatedAt Date
}

*/


/// primary key is automatically added by mongodb

const userSchema=new Schema({

    username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,     /// extra spaces from end will be removed
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true /// this automatically adds  created at,updated at

}
)

// using prehook for password
//This is a Mongoose middleware called a pre-save hook. It's like saying:

//“Before saving this user to MongoDB, run this function.”



userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();  /// .isModified is built in function 

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// compare user entered password with encrypted pswd

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}



/// jwt.sign(payload, secret, { options })

////generate access tokens


/*ACCESS TOKEN
When is it used?
→ On every authenticated API request.

Purpose?
→ Proves the user is logged in.

Expires quickly (e.g., 15 minutes).
→ This limits damage if it's ever stolen.

Example usage:
Client stores it (in memory or cookie) and sends it like:

Authorization: Bearer <access_token>

Edit*/


userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },/// it will get these details from database
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY/// expiry object
        }
    )
}



/*
REFRESH TOKEN
When is it used?
→ Only when the access token expires.

Purpose?
→ Used to get a new access token without asking the user to log in again.

Expires slowly (e.g., 7 days, 30 days).
→ Stored securely, often in HTTP-only cookies or secure storage.

Example usage:
When frontend sees access token expired, it sends:

POST /api/v1/refresh-token
Body: { refreshToken: "..." }
*/



//generate refresh tokens
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


/*
Typical Flow
Login →

Backend generates access + refresh tokens.

Sends both to frontend.

Frontend stores tokens

Access token → for regular API calls.

Refresh token → used silently to renew access token.

Access token expires →

Frontend uses refresh token to get a new one.

Refresh token expires →

User must log in again.


*/



export const User=mongoose.model("User",userSchema)  /// in database it willl be converted to users-> lowercase and plural
