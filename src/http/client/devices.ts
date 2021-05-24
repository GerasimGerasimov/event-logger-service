import { delay } from '../../helpers/utils';
import DeviceController from './controllers/device';
import { devicesInfoStore } from './devicesinfo';

export class TDevicesValueStore {

    private Tasks = {
        index: 0 as number,
        tasks: [] as Array<object>
    }

    constructor() {
    }
  
    public async * asyncGenerator () {
        let i = 0;
        while (true) {
          await this.getOnceData();
          yield i++;
        }
      }

    private async getOnceData() {
      await this.getDeviceDataOnce(this.getNextTask())
      await delay(10);
      /**TODO сделать TimeOut для Fetch */
    }

    public createTasks(reqs: Array<any>) {
        this.Tasks = {
            index: 0,
            tasks: reqs
        }
    }

    public clearTasks() {
      this.Tasks = {
          index: 0,
          tasks: []
      }
    }

    private getNextTask(): any {
        const task: any = this.Tasks.tasks[this.Tasks.index]
        if (++this.Tasks.index === this.Tasks.tasks.length) {
            this.Tasks.index = 0;
        }
        return task;
    }

    private async getDeviceDataOnce(task: any){ 
      const data = await DeviceController.getValues(task);
        for( const key in data.data) {
          devicesInfoStore.fillValuesFromReceivedData(data.data[key]);
        }
    }

}
