import excel from '../common/myexcel';
import sql from '../common/mysql';
import { Util as Ul } from '../core/utils';
import async from 'async';
import { dirname } from 'path';
import { fstat } from 'fs';
let UlFile = Ul.UtilFileDir;

export default class testExcelDb {
    private _host: string = '192.168.20.248';
    private _user: string = 'root';
    private _password: string = '123456';
    private _port: number = 3306;
    private _dataBase: string = 'whf_test';
    private _dirFiles: string[] = [];
    private _sqlLib: sql = null;
    private _dirName: string = '';

    constructor() {

    }

    //1.1: 获取目录文件目录中所有的文件
    private _handleGetDirAllFile(dirName: string, callback) {
        UlFile.getInstance().getDirFiles(dirName, (err, results) => {
            if (err) {
                callback(err);
                return;
            }

            this._dirFiles = results;
            callback(null);
        });

    }

    //1.1: 连接数据库
    private _handleDataBaseConn(callback) {
        this._sqlLib = new sql(this._host, this._user, this._password, this._port, this._dataBase);
        if (!this._sqlLib) {
            callback("new sql error");
            return;
        }

        this._sqlLib.connect((err) => {
            if (err) {
                callback(err);
                return;
            }

            callback(null);
            return;
        });
    }

    init(callbk: (err, files?: string[]) => void) {
        let dirName: string = '/Users/wuhaifeng/develop/svn/duorou/trunk/策划文档/配置';
        this._dirName = dirName;

        async.parallel([
            (callback) => {         //1.1: 获取目录文件目录中所有的文件
                this._handleGetDirAllFile(dirName, callback);
            },
            (callback) => {
                this._handleDataBaseConn(callback);
            }
        ], (err, results) => {
            if (err) {  //1.1: 连接数据库
                console.log('handle error: ', JSON.stringify(err));
                callbk("init failed");
                return;
            }

            // console.log('get table ok: ', JSON.stringify(this._dirFiles));
            callbk(null, this._dirFiles);
        });
    }

    private _getTableNameFromFileName(fileName: string): string {
        let tabName: string = '';

        //abc.excel 定位最后一个点然后截取前面的内容
        let firstIndex = fileName.lastIndexOf('/');
        let lastIndex = fileName.lastIndexOf('.');
        if (lastIndex != -1 && firstIndex != -1) {
            tabName = fileName.substring(firstIndex + 1, lastIndex);
        }

        return tabName;
    }

    private _handleClearAllTableData(fileName: string, callback) {
        if (!fileName) {
            callback('para error');
            return;
        }


        let tabName = this._getTableNameFromFileName(fileName);
        if (!tabName) {
            callback('get table name failed');
            return;
        }
        console.log(`begin to updt tableName: ${tabName}`);

        let _isCurDone: boolean = false;

        /* 1: 获取sql中指定表格中filedName  2: 根据sql中filedName 获取excel 中相关列中数据  3： 根据获取到的excel数据更新数据库(更新之前需要清空数据中该表格中的数据) */
        async.waterfall([
            (callback) => {
                //查询表格是否存在表格不存在就直接
                this._sqlLib.queryTabIsExist(tabName, (err, bIsExist) => {
                    if (err || !bIsExist) {
                        callback(null);
                        _isCurDone = true;
                        return;
                    }

                    callback(null);
                })
            },
            (callback) => {
                if (_isCurDone) {
                    callback(null);
                    return;
                }

                //清除表格中数据
                this._sqlLib.clearTableDatas(tabName, (err) => {
                    callback(err);
                    return;
                });
            },

        ], (err, results) => {

            if (err && !_isCurDone) {
                callback(err);
                return;
            }

            callback(null);
        });
        return;
    }
    //获取指定表格中的信息更新到数据库中
    private _handleUpdtDbTableDataFromExcel(fileName: string, callback) {
        if (!fileName) {
            callback('para error');
            return;
        }


        let tabName = this._getTableNameFromFileName(fileName);
        if (!tabName) {
            callback('get table name failed');
            return;
        }
        console.log(`begin to updt tableName: ${tabName}`);

        let _isCurDone: boolean = false;

        /* 1: 获取sql中指定表格中filedName  2: 根据sql中filedName 获取excel 中相关列中数据  3： 根据获取到的excel数据更新数据库(更新之前需要清空数据中该表格中的数据) */
        async.waterfall([
            (callback) => {
                //查询表格是否存在表格不存在就直接
                this._sqlLib.queryTabIsExist(tabName, (err, bIsExist) => {
                    if (err || !bIsExist) {
                        callback(null);
                        _isCurDone = true;
                        return;
                    }

                    callback(null);
                })
            },
            (callback) => {
                if (_isCurDone) {
                    callback(null);
                    return;
                }
                //1: 获取sql中指定表格中filedName
                this._sqlLib.getTabFiledName(tabName, (err, results) => {
                    if (err) {
                        callback(`${__filename} getTabFileName error: ${err}`);
                        return;
                    }

                    // console.log(`get fileds: ${results}`);
                    callback(null, results);
                });
            },
            (fileds: string[], callback) => {
                if (_isCurDone) {
                    callback(null);
                    return;
                }
                //2: 根据sql中filedName 获取excel 中相关列中数据
                if (!fileds) {
                    callback(`${__filename} get fileds empty`);
                    return;
                }

                let locExcel = new excel(fileName);
                if (!locExcel) {
                    callback(`new excel failed`);
                    return;
                }

                locExcel.getTableDesFiledDatas(fileds, (err, datas) => {
                    if (err) {
                        callback(`${__filename} get file: ${fileName} ${err}`);
                        return;
                    }

                    // console.log(`get file: ${fileName} datas: ${JSON.stringify(datas)}`);
                    callback(null, fileds, datas);
                });
            },
            (filedName, datas, callback) => {
                if (_isCurDone) {
                    callback(null);
                    return;
                }
                //3： 根据获取到的excel数据更新数据库(更新之前需要清空数据中该表格中的数据)
                this._sqlLib.clearTableDatas(tabName, (err) => {
                    if (err) {
                        console.log(`clear ${tabName} failed error: ${err}`);
                    }
                });

                this._sqlLib.insertTabData(tabName, filedName, datas, (err) => {

                    if (err) {
                        console.log(`table: ${tabName} filedName: ${filedName} error: ${err}`);
                        return;
                    }

                    console.log(`table: ${tabName} filedName: ${filedName} updt ok`);

                    callback(null);
                });
            }
        ], (err, results) => {

            if (err && !_isCurDone) {
                callback(err);
                return;
            }

            callback(null);
        });
        return;
    }

    wrokingClearAll() {
        async.waterfall([
            (callback) => {
                this.init(callback);
            },

            (dirFiles: string[], callback) => {
                if (dirFiles.length <= 0) {
                    callback("files empty");
                    return;
                }

                console.log(`dirFiles: ${JSON.stringify(dirFiles)} begin to updt`);

                //whf-dbg 
                // dirFiles = [`${this._dirName}/commonCfg.xlsx`, `${this._dirName}/dayNightEffect.xlsx`, `${this._dirName}/CollectionCfg.xlsx`];
                //更新表格中所有的数据，更新完毕以后结束
                async.map(dirFiles, this._handleClearAllTableData.bind(this), (err, results) => {
                    if (err) {
                        callback(err);
                        return;
                    }

                    console.log('clear allfile ok');
                    callback(null);
                });
            }
        ], (err, results) => {
            if (err) {
                console.log(`working error: ${err}`);
                return;
            }

            console.log('working over ok');
        });
    }

    working() {
        async.waterfall([
            (callback) => {
                this.init(callback);
            },

            (dirFiles: string[], callback) => {
                if (dirFiles.length <= 0) {
                    callback("files empty");
                    return;
                }

                console.log(`dirFiles: ${JSON.stringify(dirFiles)} begin to updt`);

                //whf-dbg 
                dirFiles = [`${this._dirName}/flowerpotCfg.xlsx`];
                //更新表格中所有的数据，更新完毕以后结束
                async.map(dirFiles, this._handleUpdtDbTableDataFromExcel.bind(this), (err, results) => {
                    if (err) {
                        callback(err);
                        return;
                    }

                    console.log('updt allfile ok');
                    callback(null);
                });
            }
        ], (err, results) => {
            if (err) {
                console.log(`working error: ${err}`);
                return;
            }

            console.log('working over ok');
        });
    }
}