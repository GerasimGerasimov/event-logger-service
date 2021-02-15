import fs = require('fs');
import path = require('path');

export const ConfDirName: string = path.resolve(__dirname,'../.././config/');

export function getAbsDirPath(dir: string): string {
    const result: string = path.resolve(`${ConfDirName}`, dir);
    return result;
}

export function validateFolderExistence(dirName: string): void {
    if (fs.existsSync(dirName)) return;
    newFunction();

    function newFunction() {
        throw new Error(`Folder not exist: ${dirName}`);
    }
}

export function getFilesList(path: string): Array<string> {
    return fs.readdirSync(path,"utf8");
}

export interface IDirСontents {
    FileName: string; // file name
    Path: string;     // relative path to file and file name ./dir/subdir/file.name
    Content: any;     // file's content
}

export function getFilesProps(root: string, FolderContentList: Array<string>):Array<IDirСontents> {
    let result:Array<IDirСontents> = [];
    FolderContentList.forEach(item => {
        result.push({
            FileName: item,
            Path: `${root}/${item}`,
            Content: fs.readFileSync(`${root}/${item}`, "utf8")
        } as IDirСontents);
    })
    return result;
}

export function getArrFromDelimitedStr(s: string, delimiter: string = ' '): Array<string> {
    return s.slice().split(delimiter);
}
  

export function getJSONFromFile(root: string, filename: string): any {
    try {
        return JSON.parse(fs.readFileSync(`${root}/${filename}`, "utf8"))
    } catch (e) {
        throw new Error(`File ${filename} not read. Error ${e.message}`)
    }

}

export function getNameFromFileName(filename: string): string {
    let i = filename.lastIndexOf('.json');
    let s = filename.slice(0, i);
    return s;
}

export function getKeyOfEnumByValue( Enum:any, Value: any, def?: string): string {
    let res: string = def || '';
    for ( const [key, value] of Object.entries(Enum)){
      if (value === Value) return key
    }
    return res;
}

export function isValueInEnum( Enum:any, Value: any): string {
    let res: string = '';
    for ( const value of Object.values(Enum)){
      if (value === Value) return Value
    }
    return res;
}

export function isEmpty(obj: Object): boolean {
    for (let key in obj) {
      // если тело цикла начнет выполняться - значит в объекте есть свойства
      return false;
    }
    return true;
  }

export async function delay(ms: number): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

export function nowDateTimeToDBStr(): string {
    return new Date().toString().split(' ').slice(1, 6).join(' ');
}