class ApiError extends Error{   // node js  gives error class
    constructor(statuscode , message="something went wrong" , error=[],stack=""){
        super(message)
        this.statuscode=statuscode
        this.data=null////
        this.message=message
        this.success=false
        this.error=error;
        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }

    }             

}

export {ApiError}




/*
Why use this?
You’ll want to standardize how errors are returned from your backend to the frontend.

This avoids sending raw stack traces or inconsistent formats.

Also enables central error handling middleware to catch all these and respond properly.
*/