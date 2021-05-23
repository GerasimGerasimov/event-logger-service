import { IServiceRespond, TMessage } from '../types';
import { ErrorMessage, IErrorMessage, validationJSON } from './../../helpers/errors';
import WSControl from './wscontroller'

export default class HostController {

    private host: string;
    private wss: WSControl;
    private ClientID: string = '';

    constructor ({ host}: { host: string}){
      this.host = host;
    }
     
    public async open() {
      this.ClientID = ''
      this.wss = null;
      this.wss = new WSControl({
          host: this.host,
          handler: this.validateIncomingMessage.bind(this) });
      this.ClientID = await this.waitForID();
      console.log(this.ClientID);
    }

    private async waitForID(): Promise<string> {
      const respond: any = await this.wss.open();
      const msg: any = this.validateIncomingMessage(respond);
      const data: any = this.decodeCommand(msg);
      return data;
    }


    public async close() {
      const res: string = await this.wss.close();
      console.log(`Connection ${this.ClientID} has been closed`);
      this.wss = null;
      this.ClientID = '';
    }

    public validateIncomingMessage(respond: any): IServiceRespond | IErrorMessage {
        let msg: any = validationJSON(respond);
        return msg;
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

    private setClientID(msg: TMessage): string {
      return msg.payload;
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

    public async getValues(request: any):Promise<any | IErrorMessage> {
        try {
            const payload = {
                cmd: 'getInfo',
                ClientID: this.ClientID,
                payload: request
            }
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