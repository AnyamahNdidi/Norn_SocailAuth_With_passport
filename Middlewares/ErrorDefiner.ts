export enum HTTP{
    OK = 200,
    CREATED = 201,
    REDIRECTED = 300,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    MOT_FOUND = 404,
    FORBIDDEN = 403,
    INTERNAL_SERVER_ERROR = 500,
    BAD_GATEWAY = 502,
    NEWWORK_TIMEOUT = 599
}

interface errorArgs{
    name: string;
    message: string,
    status: HTTP,
    isSuccess: boolean
}

export class mainAppError extends Error{
    public readonly name: string;
    public readonly message: string;
    public readonly status: HTTP;
    public readonly isSuccess: boolean;

    constructor(args: errorArgs) {
        super(args.message);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = args.name;
        this.message = args.message;
        this.status = args.status;

        if (args.isSuccess !== undefined) 
        {
            this.isSuccess = args.isSuccess;
        }

        
        Error.captureStackTrace(this)

        
    }

}