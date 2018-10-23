'use strict'
import * as path from 'path';
import * as mdSql from 'mysql';

export default class ComSql {
    private _host: string = "";
    private _user: string = "";
    private _password: string = "";
    private _port: number = 0;
    private _databaseName: string = "";
    private _log: string = 'ComSql ';
    private _connect: mdSql.Connection = null;

    constructor(host: string, user: string, password: string, port: number, databaseName: string) {
        this._host = host;
        this._user = user;
        this._password = password;
        this._port = port;
        this._databaseName = databaseName;
    }

    connect(callback: (err: any) => void) {
        console.log(`${this._log} beg conect`);
        let con = mdSql.createConnection({
            'host': this._host,
            'user': this._user,
            'password': this._password,
            'port': this._port,
            'database': this._databaseName
        });
        if (!con) {
            console.log(this._log, 'createConnection failed');
            callback(null);
            return;
        }
        this._connect = con;

        con.connect((err) => {
            if (err) {
                console.log(this._log, 'connect failed: ', err);
                callback(err);
                return;
            }

            callback(null);

            console.log(`${this._log} connect ${this._connect.threadId} ok`);
        });
    }

    /**
     * 
     * @param tabName {string} tablename
     * @param callback {( err:any, filedNames: string[])=>void}
     */
    getTabFiledName(tabName: string, callback: (err: any, filedNames: string[]) => void) {
        console.log(`${this._log} ${this._connect.threadId} beg getTabFiledName`);

        let filedNames: string[] = [];

        //par check
        if (!tabName) {
            callback("errParaTabNameInvalid", filedNames);
            return;
        }
        if (!this._connect) {
            callback("errNotConnected", filedNames);
            return;
        }
        let con: mdSql.Connection = this._connect;

        //查寻数据获取表格的相关列
        // let sql = mdSql.format('SELECT * FROM ? LIMIT 1', [tabName]);
        // let sql = mdSql.format(`SELECT * FROM ${tabName}  LIMIT 1`);
        let sql = `SELECT * FROM ${tabName} LIMIT 2`;
        con.query(sql, function (err: mdSql.MysqlError, results, fileds) {
            if (err) {
                callback(err, filedNames);
                return;
            }

            if (!fileds) {
                callback(err, filedNames)
                return;
            }

            //遍列所有的fileds，获取对象element中“name”值
            fileds.forEach((element) => {
                if (!element.hasOwnProperty("name")) {
                    return;
                }
                filedNames.push(element.name);
            });;

            callback(err, filedNames);
        });
    }

    /**
     * 
     * @param tabName 
     * @param filedName 
     * @param datas 
     * @param callback 
     */
    insertTabData(tabName: string, filedName: string[], datas: any[], callback: (err: any) => void) {
        let format = "INSERT INTO ?? (??) VALUES ?";
        let sqlStr = mdSql.format(format, [tabName, filedName, datas]);
        console.log('insertData sqlStr: ', sqlStr);

        this._connect.query(sqlStr, (err, results, fields) => {
            if (err) {
                callback(err);
                return;
            }

            callback(null);

            console.log('insertData ok affectedRows: ', results.affectedRows);
        });
    }

    /**
     * 
     * @param tabName 
     * @param callback 
     */
    queryTabData(tabName: string, callback: (err: any, datas: any) => void) {
        let format = "SELECT * FROM ??";
        let sqlStr = mdSql.format(format, [tabName]);
        this._connect.query(sqlStr, (err, results, fileds) => {

            let datas: any = null;
            if (err) {
                callback(err, datas);
                return;
            }

            if (!results) {
                callback(null, datas);
                return;
            }

            datas = JSON.stringify(results);
            datas = JSON.parse(datas);
            console.log(`query tab: ${tabName} ok `);
            callback(null, datas);
        });
    }

    //执行sql语句的命令
    _executeSqlSeq(sqlStr: string, callback: (err) => void) {
        this._connect.query(sqlStr, (err, results, fileds) => {

            let datas: any = null;
            if (err) {
                console.log(`${this._log} _executeSql: ${sqlStr} failed`);
                callback(err);
                return;
            }

            console.log(`${this._log} _executeSqlSeq: ${sqlStr} ok`);
            callback(null);
        });
    }

    /**
     *  清空表格中的数据
     * @param tableName 
     * @param callback 
     */
    clearTableDatas(tableName: string, callback: (err: any) => void) {
        let formatSql = 'TRUNCATE TABLE ??';
        let sqlStr: string = mdSql.format(formatSql, [tableName]);
        this._executeSqlSeq(sqlStr, callback);
    }


    /**
     * 
     */
    end() {
        if (this._connect) {
            this._connect.end((err) => {
                if (err) {
                    console.log(`end conect error: ${err}`);
                    return;
                }

                console.log(`end conect ${this._connect.threadId} ok`);
            });
        }
    }
}