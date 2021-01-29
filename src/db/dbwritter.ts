import { IEvent } from "../interfaces/iDBEvent";
import TDAO from "./controllers/sqlite/DAO";
import EventsRepositoty from "./controllers/sqlite/EventsRepository";

export class TDBWritter {
  
  private dao: TDAO;
  private eventsRepo: EventsRepositoty;
  private connected: boolean = false;

  constructor() {
    this.dao = new TDAO('./db/database.sqlite3');
    this.eventsRepo = new EventsRepositoty(this.dao);
  }

  private async connectToDB(){
    console.log('start to create table')
    await this.eventsRepo.createTable();
    console.log('start row count:', await this.eventsRepo.getRowCount())
    this.connected = true;
  }

  public async write(values: Set<IEvent>){
      if (! this.isConnected) {
        await this.connectToDB();
      }
      try {
        await this.dao.run('BEGIN TRANSACTION');
        for (const value of values) {
          console.log(`create record: ${value.date}, ${value.tag}`)
          await this.eventsRepo.create(value)
        }
        await this.dao.run('COMMIT TRANSACTION');
      } catch(e) {
        console.log('DB Error :', e)
      }
      console.log('end row count:', await this.eventsRepo.getRowCount())
  }

  private isConnected(): boolean {
    return this.connected;
  }
}