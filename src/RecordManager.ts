import { RecordItem } from './types';
import generateRecord from './utils/generateRecord';
class RecordManager {
  private records: RecordItem[] = [];

  async loadRecords(): Promise<void> {
    try {
      this.records = await window.electron.getAllRecords();
    } catch (error: any) {
      console.error('ERROR LOADING RECORDS:', error);
    }
  }

  async addRecord(username: string, password: string): Promise<void> {
    try {
      const id = this.records.length > 0 ? Math.max(...this.records.map(r => r.id)) + 1 : 1; 
      const newRecord = { id, username, password };
      this.records.push(newRecord);
      await window.electron.addRecord(id, username, password);
    } catch (error: any) {
      console.error("ERROR ADDING RECORD: ", error)
    }
  }

  async generateRecords(quantity: number) {
    try {
      const initialLength = this.records.length;
      const id = initialLength > 0 ? Math.max(...this.records.map(r => r.id)) + 1 : 1; 
      for (let index = id; index < quantity + id; index++) {
        const record = generateRecord(index) 
        this.records.push(record)
      }
      await window.electron.generateRecords(this.records.slice(initialLength));
    } catch (error: any) {
      console.error("ERROR GENERATING RECORDS: ", error)
    }
  }


  async deleteRecord(id: number): Promise<void> {
    try {
      this.records = this.records.filter((record) => record.id !== id);
  
      await window.electron.deleteRecord(id);
    } catch (error: any) {
      console.error("ERROR DELETING RECORD: ", error)
    }
  }

  async editRecord(id: number, username: string, password: string): Promise<void> {
    try {
      const index = this.records.findIndex((record) => record.id === id);
     
      if (index !== -1) {
        this.records[index] = { id, username, password };
      }
  
      await window.electron.editRecord(id, username, password);
    } catch (error: any) {
      console.error("ERROR EDITING RECORD: ", error)
    }
  }

  getRecords(): RecordItem[] {
    return this.records;
  }

  private sharrSearch(targetId: number): RecordItem | undefined {
    let left = 0;
    let right = this.records.length - 1;

    if(this.records.length === 1) {
      if(this.records[0].id === targetId) {
        return this.records[0]
      }
      return undefined
    } 
    
    while (left <= right) {
      const mid = Math.floor(left + ((right - left) / (this.records[right].id - this.records[left].id)) * (targetId - this.records[left].id));

      if (mid < 0 || mid >= this.records.length) {
        break;
      }
      const midRecord = this.records[mid];

      if (midRecord.id === targetId) {
        return midRecord; 
      }
      if (midRecord.id < targetId) {
        left = mid + 1; 
      } else {
        right = mid - 1; 
      }
    }
    return undefined; 
  }

  searchRecordById(id: number): RecordItem | undefined {
    const record = this.sharrSearch(id);
    if (record) {
      return record;
    } else {
      return undefined;
    }
  }
}

export default RecordManager;
