class appError extends Error {
    constructor (message,reason){
        super(message)
        this.reason = reason
    }
}

module.exports ={appError}