export type RecordItem = {
  id: number;
  username: string;
  password: string;
}

declare global {
  interface Window {
    electron: {
      addRecord: (id:number, username: string, password: string) => Promise<string>;
      getAllRecords: () => Promise<{ id: number; username: string; password: string }[]>;
      editRecord: (id: number, username: string, password: string) => Promise<void>;
      deleteRecord: (id: number) => Promise<void>;
      generateRecords: (records: RecordItem[]) => Promise<void>;
    };
  }
}
