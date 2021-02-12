import DeviceController from './controllers/device';
import { devicesInfoStore } from './devicesinfo';

export class TDevicesValueStore {

    private autoReloadTimer: any;
    private Tasks = {
        index: 0 as number,
        tasks: [] as Array<object>
    }

    constructor() {
        //this.createTasks(reqs);
        //this.startAutoReloadData();
    }

    public createTasks(reqs: Array<any>) {
        this.Tasks = {
            index: 0,
            tasks: reqs
        }
    }

    public stopAutoReloadData(){
        clearTimeout(this.autoReloadTimer);
    }

    async getDeviceData(task: any){
      this.stopAutoReloadData()
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

    public startAutoReloadData() {
        this.autoReloadTimer = setTimeout(async ()=>{
            const task: any = this.Tasks.tasks[this.Tasks.index]
            if (task) {
                await this.getDeviceData(task);
            }
            if (++this.Tasks.index === this.Tasks.tasks.length)
                this.Tasks.index = 0;
        },
        10000)
    }
}
