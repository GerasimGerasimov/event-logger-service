import { IServiceRespond, TMessage } from '../types';
import { ErrorMessage, IErrorMessage, validationJSON } from './../../helpers/errors';
import WSControl from './wscontroller'

export default class HostController {

    private  wss: WSControl;
    private ClientID: string = '';
    private onIncomingMessage: Function = undefined;
    
    constructor ({ host, handler }: { host: string; handler: Function; }){
        this.wss = new WSControl({ host, handler: this.checkIncomingMessage.bind(this) });
        this.onIncomingMessage = handler;
    }
     
    public checkIncomingMessage(respond: any): IServiceRespond | IErrorMessage {
      try {
        let msg: any = validationJSON(respond);
        this.decodeCommand(msg);
        if (this.onIncomingMessage)
          return this.onIncomingMessage(msg);
      } catch(e) {
        return ErrorMessage (e.message);
      }
    }

    private decodeCommand(msg: TMessage): any {
        const key = msg.cmd;
        const commands = {
            'id'           : this.setClientID.bind(this),
            'getInfo'      : this.handleGetInfo.bind(this),
            'getValues'    : this.getValues.bind(this),
            'default': () => {
                return ErrorMessage('Unknown command');
            }
        };
        return (commands[key] || commands['default'])(msg)
    }

    private setClientID(msg: TMessage) {
      this.ClientID = msg.payload;
    }

    private handleStatusField (respond: any): void {
        if (!respond.status) throw new Error ('Status field does not exist');
    }

    private handleErrorStatus(respond: any): void {
        if (respond.status === 'Error') throw new Error (respond.msg);
    }

    private async handleGetInfo(msg: TMessage):Promise<any | IErrorMessage> {

    }

    public async getInfo():Promise<any | IErrorMessage> {
        try {
            const payload = {
                cmd: 'getInfo',
                ClientID: this.ClientID
            }
            return await this.wss.send(payload)
                .then (this.validationJSON);
        } catch(e) {
            console.log(e);
            throw new Error (`Fetch Error: ${e.message}`);
        }
    }

    public async getValues(host: string, ID: string):Promise<any | IErrorMessage> {
        try {
            const payload: string = JSON.stringify({get:ID});
            return await this.wss.send(payload)
                .then (this.validationJSON);
        } catch(e) {
            console.log(e);
            throw new Error (`Fetch Error: ${e.message}`);
        }
    }

    private validationJSON (data: any): any | IErrorMessage {
        try {
            return JSON.parse(data);
        } catch (e) {
            throw new Error ('Invalid JSON');
        }
    }
}