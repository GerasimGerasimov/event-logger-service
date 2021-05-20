import { IServiceRespond, TMessage } from '../types';
import { ErrorMessage, IErrorMessage, validationJSON } from './../../helpers/errors';
import WSControl from './wscontroller'

interface PromiseCallback {
    resolve: any,
    reject: any
}

export default class HostController {

    private host: string;
    private wss: WSControl;
    private ClientID: string = '';
    private promise: PromiseCallback = {
        resolve: null,
        reject: null
    }
    
    constructor ({ host}: { host: string}){
      this.host = host;
    }
     
    public async open() {
      this.ClientID = ''
      this.wss = null;
      this.wss = new WSControl({
          host: this.host,
          handler: this.checkIncomingMessage.bind(this) });
      //и тут надо дождаться получения ID. как?!
      const ID: string = await this.waitFor();
      console.log(ID)
    }

    private async waitFor(): Promise<string> {
      return new Promise((resolve, reject) => {
            //if (this.ClientID) return resolve(this.ClientID);
        this.wss.setHandler(
            this.checkIncomingMessage.bind(this));
        this.promise = {resolve, reject};
      })
    }


    public async close() {
      this.ClientID = ''
      this.wss.close();
      this.wss = null;
      this.promise = {resolve:null, reject:null};
    }

    public checkIncomingMessage(respond: any): IServiceRespond | IErrorMessage {
      try {
        let msg: any = validationJSON(respond);
        return this.decodeCommand(msg);
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
      return this.promise.resolve(this.ClientID)
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