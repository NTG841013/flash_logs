import {AuthStatus} from "./index.js";

export interface LogSecurity {
    auth_status?:AuthStatus;
    suspicious?:Boolean;
    tags?:string[];
}
