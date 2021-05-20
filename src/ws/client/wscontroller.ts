import WebSocket = require('ws');

interface handler {({}): any;}

export default class WSControl {

    private host: string;
    private ws:WebSocket;
    private hostState: boolean = false;
    private onIncomingMessage: handler;

    constructor ({ host, handler }: { host: string; handler: handler; }){
        this.host = host;
        this.onIncomingMessage = handler;
        this.initSocket();
    }

    public setHandler(handler: handler) {
      this.onIncomingMessage = handler;
    }

    public close() {
      this.ws.close();
      this.ws = null;
    }

    public async send(payload: any){
      await this.waitForConnect();
      this.ws.send(JSON.stringify(payload));
      await this.waitBufferRelease();
    }

    // Инициализация сокета и восстановление связи
    private initSocket() {
        this.ws = new WebSocket(this.host);
        this.ws.onerror = this.onError.bind(this);
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onclose = this.onClose.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
    }

    private onOpen(event: any) {
        console.log(`Opened connection to ${this.host}`);
        this.hostState = true;
    }    

    private onError(event: any) {
        console.log(`Error of connection to ${this.host} ${event}`);
    }

    private onClose(event: any) {
        console.log(`Closed connection to ${this.host}`);
        this.hostState = false;
    }

    private onMessage(msg: any) {
      if (this.onIncomingMessage) {
        this.onIncomingMessage(msg.data);
      }
    }

    private async waitForConnect(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            if (this.hostState) return resolve('');
            console.log('waitForConnect');
            const Timer = setInterval( ()=>{
                if (this.hostState) { 
                    clearInterval(Timer);
                    return resolve('');
                }
            }, 100);
        })
    }

    //чтени сокета в режиме запрос-ожидание ответа- ответ
    private async waitBufferRelease(): Promise<any> {
        return new Promise((resolve, reject) => {
            var timeOutTimer: any = undefined;
            var chekBufferTimer: any = undefined;
            if (this.ws.bufferedAmount === 0)
                return resolve('OK, buffer is empty'); //буфер чист
            //ошибка, если буфер не очистился за 1 сек 
            timeOutTimer = setTimeout( () => {
                clearTimeout(timeOutTimer);
                clearInterval(chekBufferTimer);
                reject(new Error ('Time out, buffer does not empty'))
            }, 1000);
            //постоянная проверка буфера на очистку
            chekBufferTimer = setInterval( () => {
                if (this.ws.bufferedAmount === 0) {
                    clearTimeout(timeOutTimer);
                    clearInterval(chekBufferTimer);
                    return resolve('OK, buffer is empty'); //буфер чист
                }
            }, 1);
        });
    }
}