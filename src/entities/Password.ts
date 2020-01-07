export class Password {
    passwordManagerRef:string;
    passwordValue:string;
    state: PasswordState;
}

export enum PasswordState {
    Saved,
    NotSaved,
    UserProvided,
}