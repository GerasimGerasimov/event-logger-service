import { IEvent } from "./iDBEvent";
import TDAO from "./controllers/sqlite/DAO";
import EventsRepositoty from "./controllers/sqlite/EventsRepository";

export class TDBWritter {
  
  private dao: TDAO;
  private eventsRepo: EventsRepositoty;
  private connected: boolean = false;

  constructor(path:string) {
    this.dao = new TDAO(path);
    console.log(`Try to connect to DB by ${path}`)
    this.eventsRepo = new EventsRepositoty(this.dao);
  }

  public async connectToDB(){
    console.log('start to create table')
    await this.eventsRepo.createTable();
    console.log('table is created')
    console.log('start row count:', await this.eventsRepo.getRowCount())
    this.connected = true;
  }

  public async write(values: Set<IEvent>){
    if (values.size != 0) {
      try {
        await this.dao.run('BEGIN TRANSACTION');
        for (const value of values) {
          console.log(`create record: ${value.date}, ${value.tag}`)
          await this.eventsRepo.create(value)
        }
      } catch(e) {
        console.log('DB Error :', e)
      }
      await this.dao.run('COMMIT TRANSACTION');
      console.log('end row count:', await this.eventsRepo.getRowCount())
    }
  }

  private get isConnected(): boolean {
    return this.connected;
  }
}