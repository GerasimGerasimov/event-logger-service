import WebSocket = require('ws');

interface handler {({}): any;}

export default class WSControl {

    private host: string;
    private ws:WebSocket;
    private hostState: boolean = false;

    constructor ({ host, handler }: { host: string; handler: handler; }){
        this.host = host;
    }

    public async close(): Promise<string> {
      this.ws.close();
      const res: string = await this.waitForEvent();
      this.ws = null;
      return res;
    }

    public async send(payload: any){
      //await this.waitForConnect();
      this.ws.send(JSON.stringify(payload));
      await this.waitBufferRelease();
    }

    public async waitForEvent(): Promise<any> {
        return new Promise((resolve, reject)=>{
            this.ws.onerror = (event) => {
                console.log(`Error of connection to ${this.host} ${event}`);
                reject(`Error of connection to ${this.host} ${event}`);
            };
            this.ws.onopen = (event) => {
                console.log(`Opened connection to ${this.host}`);
                this.hostState = true;
            };
            this.ws.onclose = (event) => {
                console.log(`Closed connection to ${this.host}`);
                this.hostState = false;
                resolve('close');
            };
            this.ws.onmessage = (message) => {
                resolve(message.data);
            }
        }
        )
    }
    // Инициализация сокета и восстановление связи
    public async open(): Promise<any> {
        this.ws = new WebSocket(this.host);
        return await this.waitForEvent();
    }

   /*
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
    */
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