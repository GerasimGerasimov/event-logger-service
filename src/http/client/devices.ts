import DeviceController from './controllers/device';
import { devicesInfoStore } from './devicesinfo';

export class TDevicesValueStore {
    count: number = 0;
    private autoReloadTimer: any;
    private Tasks = {
        index: 0 as number,
        tasks: [] as Array<object>
    }

    constructor() {
        this.tickTimer();
    }

    private createTasksAndStartDataLoop () {
        //1. создать запросы
        this.Tasks = {
            index: 0,
            tasks: []//devicesInfoStore.createRequests()
            /**TODO надо повторить жту функцию из 
            dexs-operator-panel\src\store\devices\devicesinfo.ts */
        }
        //2. запустить цикл чтения данных
        this.startAutoReloadData();
    }

    incCounter(){
        this.count++;
    }

    async getDeviceData(task: any){
        clearTimeout(this.autoReloadTimer);
        try {
            const data = await DeviceController.getData(task);
                for( const key in data.data) {
                    devicesInfoStore.fillValuesFromReceivedData(data.data[key]);
                }
        } catch (e) {
            console.log(e);
        }
        this.startAutoReloadData();
    }
    
    private startAutoReloadData() {
        this.autoReloadTimer = setTimeout(async ()=>{
            const task: any = this.Tasks.tasks[this.Tasks.index]
            await this.getDeviceData(task);
            if (++this.Tasks.index === this.Tasks.tasks.length)
                this.Tasks.index = 0;
        },
        10)
    }

    tickTimer(){
        setInterval(()=>{
            this.incCounter();
        }, 1000);
    }
}

export const devicesValueStore:TDevicesValueStore = new TDevicesValueStore();