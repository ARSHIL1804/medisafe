export class ShowAlertEvent{
    event: CustomEvent<unknown>;
    
    constructor(message:string){
       this.event = new CustomEvent('showAlert',{
         detail:message
       })
    }
}

export class HideAlertEvent{
    event: CustomEvent<unknown>;
    
    constructor(message:string){
       this.event = new CustomEvent('hideAlert',{
         detail:message
       })
    }
}