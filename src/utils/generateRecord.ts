import { RecordItem } from "../types";

function generateRecord(id: number, unameLength: number = 8, pwdLength: number = 10): RecordItem {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  function generateRandomString(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  return {
    id,
    username: generateRandomString(unameLength),
    password: generateRandomString(pwdLength),
  };
}

export default generateRecord;