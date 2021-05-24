import HostController from "../../../ws/client/controller";

export default class DeviceController {

    private static Client: HostController;

    public static init(Client: HostController) {
      this.Client = Client;
    }
    
    public static async  getValues(request: object): Promise<any> {
        return await this.Client.getValues(request)
    }

    public static async getDevicesInfo(): Promise<any> {
        try {
            return await this.Client.getInfo();
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