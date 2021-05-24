import WebSocket = require('ws');
interface getDeviceDataFunc {({}): any;}
import {Socket, TSocketParameters} from '../wsone';

export default class WSServer {
    private https: any;
    private wss: any;
    private sockets: Set<Socket>;

    private proc: getDeviceDataFunc  = undefined;
    private notificationTimer: any = null;

    constructor (https: any, proc: getDeviceDataFunc) {
        this.https = https;
        this.proc = proc;
        this.sockets = new Set<Socket>();
        this.init();
    }

    private init () {
        this.wss = new WebSocket.Server({server: this.https});
        this.wss.on('connection', this.connectionOnWss.bind(this));
    }

    private connectionOnWss( ws: WebSocket) {
        console.log('Connection');
        let arg: TSocketParameters = {
            ws,
            onCloseAction: this.closeSocket.bind(this),
            onGetData: this.getData.bind(this)
        }
        let socket: Socket = new Socket(arg);
        this.sockets.add(socket);
        //отправляю сообщение с идентификатором подключения
        socket.send({cmd:'id',
                     payload: socket.ID})
    }

    private closeSocket(ID: string){
        console.log(ID);
        try {
            this.sockets.forEach((socket: Socket) => {
                if (socket.ID === ID) {
                    this.sockets.delete(socket);
                    throw new Error(`Connection ${ID} has closed`)
                }
            })
        } catch (e) {
            console.log(e);
        } 
    }

    public sendNotification() {
      this.sockets.forEach((socket: Socket) => {
        socket.send({cmd:'dbchanged',
                     payload: socket.ID})
      })
    }

    public sendNotificationAfter(delay: number) {
        if (this.notificationTimer !== null) return;
        this.notificationTimer = setTimeout(()=>{
            this.sendNotification();
            clearTimeout(this.notificationTimer);
            this.notificationTimer = null;
        }, delay);
    }

    private getData(request: any): any {
        const payload = this.proc(request);
        return payload;
    }

}