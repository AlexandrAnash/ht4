import {SourceService} from './SourceService';
const dbName = 'SourceTvDb';
const dbVersion = 2023;
const tableWeek = 'ListTvOnWeek';
class IndexedDbApi {
    constructor() {
        this.initDB();
    }
    initDB() {
        if (!window.indexedDB) {
            window.alert('Ваш браузер не поддерживат стабильную версию IndexedDB. Такие-то функции будут недоступны');
        }
        const request = indexedDB.open(dbName, dbVersion);

        request.onerror = function (event) {
            console.log('onerror,', event);
        };
        // если меняем версию, обновляем все данные 
        request.onupgradeneeded = (event) => {
            var db = event.target.result;
            const sourceService = new SourceService();
            if (db.objectStoreNames.contains(tableWeek)) {
                db.deleteObjectStore(tableWeek);
            }
            this._createListTvOnWeek(db, sourceService.getListTvOnWeek());
        };
    }
    _createListTvOnWeek(db, list) {
        const objectStore = db.createObjectStore(tableWeek, { keyPath: 'id', autoIncrement: true  });
        objectStore.createIndex('id', 'id', { unique: true });
        list.forEach((item) => {
            objectStore.add(item);
        });
    }

    connectDB() {
        return new Promise((resolve, reject) => {
            var request = indexedDB.open(dbName, dbVersion);
            request.onsuccess = () => {
                resolve(request.result);
            }
            request.onerror = function(e) {
                reject(e);
            }
        });
    }
    getListTvOnWeek() {
        return this.connectDB().then((db) => {
            return new Promise((resolve, reject) => {
                const trans = db.transaction(tableWeek, "readonly");
                const request = trans.objectStore(tableWeek);
                const cursorRequest = request.openCursor();
                var items = [];
                trans.oncomplete = () => {
                    resolve(items);
                };
                cursorRequest.onerror = (error) => {
                    reject(error);
                };
                cursorRequest.onsuccess = (evt) => {
                    var cursor = evt.target.result;
                    if (cursor) {
                        items.push(cursor.value);
                        cursor.continue();
                    }
                };
            });
        });
    }   
    deleteDb() {
        const req = indexedDB.deleteDatabase(dbName);
        req.onsuccess = function () {
            console.log('Deleted database successfully');
        };
        req.onerror = function () {
            console.log('Could not delete database');
        };
        req.onblocked = function () {
            console.log('Couldn not delete database due to the operation being blocked');
        };
    }

}
export {IndexedDbApi}