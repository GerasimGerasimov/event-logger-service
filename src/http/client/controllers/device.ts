import HostController from "../../../ws/client/controller";

export default class DeviceController {

    private static Client: HostController;

    public static init(Client: HostController) {
      this.Client = Client;
    }
    
    public static async  getData(request: object): Promise<any> {
        try {
            return await this.Client.getValues(request)
                .then (this.validationJSON);
        } catch(e) {
            throw new Error (`Fetch Error: ${e.message}`);
        }
    }

    public static async getDevicesInfo(): Promise<any> {
        try {
            return await this.Client.getInfo()
                .then (this.validationJSON);
        } catch(e) {
            //console.log(e);
            throw new Error (`Fetch Error: ${e.message}`);
        }
    }

    private static validationJSON (data: any): any {
        try {
            const result = JSON.parse(data);
            return result;
        } catch (e) {
            throw new Error ('Invalid JSON');
        }
    }
}