import * as path from 'path';                     // 测试能否正常使用 Node 的内置模块
import * as _ from 'lodash';
import * as async from 'async';
import * as fs from 'fs';
import { exec } from 'child_process';
import * as foox from 'ws';
import foo = require("ws");
// var exec = require('child_process').exec;


export module Util {
  export const UTIL_VALUE: number = 123;
  /**
   * 一个正常的class
   * 
   * 不得不说, TS 使用起来真是舒服,各种该有的东西都替你考虑到了
   * 很舒心
   */
  export class NodeModuleTester {
    public static readonly STATIC_VAR = 'STATIC';   // 测试static变量
    _num: number = 0;

    constructor(                                    // 测试构造方法
      private readonly f1: string,
      private readonly f2: number) {

    }

    public static testPath() {                      // 测试静态方法
      const curdir = './';

      console.log(path.resolve(curdir));
    }

    public sayHello() {
      console.log("this is say helo function");
    }

  }

  interface LabelType {
    label: string;
  }


  interface InterSearchFunc {
    (srcStr: string, subStr: string): boolean;
  }
  export class Module implements LabelType {
    label: string = "";
    _fullname: string = "wuhaifeng";
    SayHi() {
      console.log("this is module hi");

      console.log(_.escape('fred, barney, & pebbles'));

      let x = _.parseInt('70', 8);
      console.log(`x = ${x}`);

      var users = [
        { 'user': 'barney', 'active': true },
        { 'user': 'fred', 'active': false },
        { 'user': 'pebbles', 'active': false }
      ];

      console.log(_.dropRightWhile(users, function (o) {
        return (o.active != true);
      }));

      let input = [1, 2, 3, 4];
      let [first, second, ...rest] = input;
      let o = {
        a: "foo",
        b: 12,
        c: "bar"
      };
      let { a, c } = o;
      a = o.c;
      console.log("first: ", first, " second: ", second, " rest: ", rest, " a: ", a, " c: ", c);
      this.name({ a: "steven" });

      let myObj = {
        size: 10,
        label: "this is steven label"
      };
      this.printLabel(myObj);
      this.testInter();
      this.testFor();
      console.log("--------");
    }

    name(params: { a: string, b?: number }) {
      let { a, b = 1001 } = params;
      console.log("a= ", a, " b: ", b);
    }

    printLabel(labObj: LabelType) {
      console.log(labObj.label)
    }

    testInter() {
      let a: number[] = [1, 2, 3];
      let ro: ReadonlyArray<number> = a;
      let rw: Array<number> = a;
      rw.push();

      let mySearch: InterSearchFunc;

      mySearch = function (source: string, subString: string) {
        let result = source.search(subString);
        return result > -1;
      }
    }


    testFx<T>(arg: T): T {
      return arg;
    }

    testFor() {
      this.testFx("123");
      console.log("tesıtFor");
      let array = [1, 'steven', 2, 'wfeewf', 1, 'steven', 2, 'wfeewf', 1, 'steven', 2, 'wfeewf', 1, 'steven', 2, 'wfeewf', 1, 'steven', 2, 'wfeewf'];
      // for (const value of array) {
      //   console.log(value);
      // }
      array.forEach((elem) => {
        console.log(elem);
      })
      console.log('1111111');
    }

    get fullname(): string {
      return this._fullname;
    }

    start(callback: (any) => void) {
      setTimeout(() => {
        callback('Hello');
        setTimeout(() => {
          callback('And Welcome');
          setTimeout(() => {
            callback('To Async Await Using TypeScript');
          }, 1000);
        }, 1000);
      }, 1000);
    };

    startAsy() {

    }
    testAsy() {
      this.start((text) => { console.log(text) })
    }

    setTimeoutAsy(ms: number) {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms, 'done');
      });
    }
    //1s 以后触发特定的回调
    testPromise() {
      // setTimeout((val) => {
      //   console.log(val)
      // }, 1, 'done');

      this.setTimeoutAsy(1000).then((val) => {
        console.log('111, ', val);
      }
      );
    }

    testAsync() {
      async.series([
        function (callback) {
          setTimeout(() => {
            console.log('111 one');
            callback(null, 'one');
          }, 1000)
        },
        function (callback) {
          console.log('22222');
          callback(null, ['two', 'three']);
        }
      ],
        function (err, results) {
          console.log(`ret err: ${err} results: ${JSON.stringify(results)}`);

        });
    }

    asyncHandle(item: string, callback: (err, results: string[]) => void) {
      callback(null, [item.toUpperCase()])
    }

    testAsyncX1() {
      console.log('202222');
      var
        directoryAbove300;

      function directoryListing(initialPath, callback) {
        fs.readdir(DirName, (err, names) => {
          if (err) {
            callback(err);
            return;
          }

          async.map(names, function (fileName, callback) {
            callback(null, `${DirName}/${fileName}`);
          }, function (err, results) {
            if (err) {
              callback(err);
              return;
            }

            callback(null, results);
          });
        });
      }

      function arrayFsStat(fileNames, callback) {
        async.map(
          fileNames,
          fs.stat,
          function (err, stats) {
            if (err) { callback(err); } else {
              callback(err, fileNames, stats);
            }
          }
        );
      }

      function arrayFsReadFile(fileNames, callback) {
        async.map(
          fileNames,
          function (aFileName: string, readCallback) {
            fs.readFile(aFileName, 'utf8', readCallback);
          },
          function (err, contents) {
            if (err) { callback(err); } else {
              callback(err, contents);
            }
          }
        );
      }

      function mergeFilenameAndStat(fileNames, stats) {
        return stats.map(function (aStatObj, index) {
          aStatObj.fileName = fileNames[index];
          return aStatObj;
        });
      }

      function above300(combinedFilenamesAndStats) {
        return combinedFilenamesAndStats
          .filter(function (aStatObj) {
            return aStatObj.size >= 3;
          });
      }

      function justFilenames(combinedFilenamesAndStats) {
        return combinedFilenamesAndStats
          .map(function (aCombinedFileNameAndStatObj) {
            return aCombinedFileNameAndStatObj.fileName;
          })
      }

      //These functions are synchronous 
      function justFile(Stats) {
        console.log(`justFile Stats ${Stats.length}`);
        return Stats.filter(function (statObj: fs.Stats) {
          return statObj.isFile();
        });

      }

      function justNormalFile(fileNames) {
        return fileNames.filter(function (fileName) {
          return path.extname(fileName).endsWith('txt');
        });
      }

      //async.seq will produce a new function that you can use over and over
      directoryAbove300 = async.seq(
        directoryListing,
        arrayFsStat,
        async.asyncify(mergeFilenameAndStat),
        async.asyncify(justFile),
        async.asyncify(above300),
        async.asyncify(justFilenames),
        async.asyncify(justNormalFile),
        arrayFsReadFile
      );

      let DirName: string = '/Users/wuhaifeng/develop/code/testdir';
      directoryAbove300(
        DirName,
        function (err, fileNames, stats, contents) {
          if (err) {
            console.error(err);
          } else {
            console.log(fileNames);
          }
        }
      );
    }
    testAsyncX3() {
      //Our anonymous refactored into named functions 
      let DirName: string = '/Users/wuhaifeng/develop/code/testdir';
      function directoryListing(callback) {
        fs.readdir(DirName, (err, names) => {
          if (err) {
            callback(err);
            return;
          }

          async.map(names, function (fileName, callback) {
            callback(null, `${DirName}/${fileName}`);
          }, function (err, results) {
            if (err) {
              callback(err);
              return;
            }

            callback(null, results);
          });
        });
      }
      function arrayFsStat(fileNames, callback) {
        console.log(`arrayFsStat fileNames: ${JSON.stringify(fileNames)}`);
        async.map(
          fileNames,
          fs.stat,
          function (err, stats) {
            if (err) { callback(err); } else {
              callback(err, fileNames, stats);
            }
          }
        );
      }

      function arrayFsReadFile(fileNames, callback) {
        console.log(`arrayFsReadFile ${JSON.stringify(fileNames)}`);
        async.map(
          fileNames,
          function (aFileName: string, readCallback) {
            fs.readFile(aFileName, 'utf8', readCallback);
          },
          function (err, contents) {
            if (err) { callback(err); } else {
              callback(err, contents);
            }
          }
        );
      }


      function mergeFilenameAndStat(fileNames, stats) {

        return stats.map(function (aStatObj, index) {
          aStatObj.fileName = fileNames[index];
          return aStatObj;
        });
      }

      function above300(combinedFilenamesAndStats) {
        return combinedFilenamesAndStats
          .filter(function (aStatObj) {
            return aStatObj.size >= 1;
          });
      }

      //These functions are synchronous 
      function justFile(Stats) {
        console.log(`justFile Stats ${Stats.length}`);
        return Stats.filter(function (statObj: fs.Stats) {
          return statObj.isFile();
        });

      }

      function justFilenames(combinedFilenamesAndStats) {
        console.log(`justFilenames Stats ${combinedFilenamesAndStats.length}`);
        return combinedFilenamesAndStats
          .map(function (aCombinedFileNameAndStatObj) {
            return aCombinedFileNameAndStatObj.fileName;
          });
      }

      function justNormalFile(fileNames) {
        return fileNames.filter(function (fileName) {
          return path.extname(fileName).endsWith('txt');
        });
      }

      async.waterfall([
        directoryListing,
        arrayFsStat,
        async.asyncify(mergeFilenameAndStat),   //asyncify wraps synchronous functions in a err-first callback
        async.asyncify(above300),
        async.asyncify(justFile),
        async.asyncify(justFilenames),
        async.asyncify(justNormalFile),
        arrayFsReadFile
      ],
        function (err, contents) {
          if (err) {
            console.error(err);
          } else {
            console.log(contents);
          }
        }
      );
    }
    testAsyncX2() {
      var
        startTime = new Date().getTime(),   //the unix timestamp in milliseconds
        runCount = 0;

      async.until(
        function () {
          //return true if 4 milliseconds have elapsed, otherwise false (and continue running the script)
          return new Date().getTime() > (startTime + 5);
        },
        function (callback) {
          runCount += 1;
          fs.writeFile(
            'timed-file-' + runCount + '.txt',    //the new file name
            'This is file number ' + runCount,  //the contents of the new file
            callback
          );
        },
        function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log('Wrote files.');
          }
        }
      );
    }

    testTermal() {
      // var exec = require('child_process').exec;
      var dirName = '/Users/wuhaifeng/develop/svn/test/test';
      let cmdStr = `svn diff -r 999:1001:999:1002 --summarize ${dirName}`;

      var iconv = require('iconv-lite');
      var encoding = 'GBK';

      // let cmdStr = `ls -al ${dirName}`;
      exec(cmdStr, function (err, stdout, stderr) {
        if (err) {
          console.log('ret error:' + stderr);
        } else {
          var newData = iconv.decode(new Buffer(stdout), encoding);//编码转换
          console.log(newData);

          // let re = /^[AMU]\s+(.+[.]xlsx)/gm;
          // let rets = re.exec(orStr);
          // while (rets && rets[1]) {
          //   console.log(rets[1]);
          //   rets = re.exec(orStr);
          // }
        }
      });

    }

    testWs() {

      // let _port: number = 3001;
      // let _server = new WebSocket.Server({ port: _port });
      // _server.on('connection', (ws, req) => {
      //   console.log(`server address info ${JSON.stringify(_server.address)}`);

      //   ws.on('message', (msg) => {
      //     console.log(`testWs receive msg: ${msg}`);
      //     _server.clients.forEach((client) => {
      //       client.send(msg);
      //     });
      //   })
      // });


      const ws = new foo('ws://121.40.165.18:8800');

      ws.on('message', (msg) => {
        console.log(`RecvMsg: ${JSON.stringify(msg)}`);
      });

      ws.on('open', function open() {

        ws.send("111");
      });


    }
    testRegExp() {
      let orStr = "M       /Users/wuhaifeng/develop/svn/test/test/config/plotCfg.xlsx\nM       /Users/wuhaifeng/develop/svn/test/test/config/randeventAnimal.xlsx";
      console.log(orStr);

      let re = /^[AMU]\s+(.+[.]xlsx)/gm;
      let rets = re.exec(orStr);
      while (rets && rets[1]) {
        console.log(rets[1]);
        rets = re.exec(orStr);
      }

      // var myString = "Hello 1 word. Sentence number 2.";
      // var splits = myString.split(/(\d)/);

      // console.log(splits);
      // var names = "Harry Trump ; Fred Barney;; Helen Rigby ; Bill Abel ;Chris Hand ";

      // console.log(names);

      // var re = /\s*;\s*/;
      // var nameList = names.split(re, 2);

      // console.log(nameList);
      // function splitString(stringToSplit, separator) {
      //   var arrayOfStrings = stringToSplit.split(separator);

      //   console.log('The original string is: "' + stringToSplit + '"');
      //   console.log('The separator is: "' + separator + '"');
      //   console.log("The array has " + arrayOfStrings.length + " elements: ");

      //   for (var i = 0; i < arrayOfStrings.length; i++)
      //     console.log(arrayOfStrings[i] + "/ ");
      // }

      // var tempestString = "Oh  brave new world that has such people in it.";
      // var monthString = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec";

      // var space = " ";
      // var comma = ",";

      // splitString(tempestString, space);
      // // splitString(tempestString);
      // splitString(monthString, comma);

      // var re = /(\w+)\s(\w+)/;
      // var str = "John Smith";
      // var newstr = str.replace(re, "$2");
      // // Smith, John
      // console.log(newstr);

      // Match "quick brown" followed by "jumps", ignoring characters in between
      // Remember "brown" and "jumps"
      // Ignore case
      // var re = /quick\s(brown).+?(jump)/ig;
      // var result = re.exec('The Quick Brown Fox Jumps Over The Lazy Dog');
      // console.log(result);
      // var regex1 = RegExp('foo*', 'g');
      // var str1 = 'table football, foosball';
      // var array1;

      // while ((array1 = regex1.exec(str1)) !== null) {
      //   console.log(`Found ${array1[0]}. Next starts at ${regex1.lastIndex}.`);
      //   // expected output: "Found foo. Next starts at 9."
      //   // expected output: "Found foo. Next starts at 19."
      // }


      // var myRe = /d(b+)d/g;
      // var myArray = myRe.exec("cdbbdbdbdsbz");
      // console.log(`${JSON.stringify(myArray)}`);

      // var re = /^[AM]\s+([\w.]+)/mg;
      // var re = /a*/;
      // var str = "aaaaaaa   dcfdf   sdfd   ";
      // // var str = "M    abc.txt  \nA    wefef.txt";
      // var myArray = str.match(re);

      // var s = "Hello i am steven!";
      // var regex1 = /am\s(\w+)/;
      // let array = s.match(regex1);
      // console.log(array);

      // var text = "First line\nsecond line";
      // var regex = /(\S+) line\n?/y;

      // var match = regex.exec(text);
      // console.log(match[1]);  // prints "First"
      // console.log(regex.lastIndex); // prints 11

      // var match2 = regex.exec(text);
      // console.log(match2[1]); // prints "Second"
      // console.log(regex.lastIndex); // prints "22"

      // var match3 = regex.exec(text);
      // console.log(match3 === null); // prints "true"

      // var url = "http://xxx.domain.com";
      // console.log(/[^.]+/.exec(url)[0].substr(7)); // prints "xxx"
    }
    testAsyncx() {
      let strs = ['111', '11', 'c'];

      //test concat
      // async.concat(['/Users/wuhaifeng/develop/svn/duorou/trunk', '/Users/wuhaifeng/develop/svn/shizi'], fs.readdir, function (err, files) {
      //   if (err) {
      //     console.log(JSON.stringify(err));
      //     return;
      //   }
      //   console.log(JSON.stringify(files));
      // });


      // async.concat(strs, this.asyncHandle, function (err, results) {
      //   if (err) {
      //     console.log(JSON.stringify(err));
      //     return;
      //   }
      //   console.log(JSON.stringify(results));
      // });

      //test detect
      // async.detect(strs, function (elem, callback: (err, boolean) => void) {
      //   if (elem.startsWith('1')) {
      //     callback(null, true);
      //     return;
      //   }

      //   callback(null, false);
      // }, function (err, result) {
      //   if (err) {
      //     console.log(JSON.stringify(err));
      //     return;
      //   }
      //   console.log(JSON.stringify(result));

      // });

      //test eachOf
      // var obj = { dev: "/dev.json", test: "/test.json", prod: "/prod.json" };
      // var configs = {};

      // async.forEachOf(obj, function (value, key, callback) {
      //   fs.readFile(__dirname + value, "utf8", function (err, data) {
      //     if (err) return callback(err);
      //     try {
      //       configs[key] = JSON.parse(data);
      //     } catch (e) {
      //       return callback(e);
      //     }
      //     callback();
      //   });
      // }, function (err) {
      //   if (err) console.error(err.message);
      //   console.log(JSON.stringify(configs));
      //   // configs is now a map of JSON data
      //   // doSomethingWith(configs);
      // });

      // async.map(['file1', 'file2', 'file3'], fs.stat, function (err, results) {
      //   // results is now an array of stats for each file
      // });


      console.log('000');
      async.waterfall([
        function (callback) {
          async.map(['/Users/wuhaifeng/develop/svn/shizi', '/Users/wuhaifeng/develop/code/ts/project'], fs.readdir,
            function (err, results) {
              if (err) {
                // console.log(`error: ${ err }`);
                callback(err);
                return;
              }
              callback(null, results);
              console.log('1111');
              // console.log(`results: ${ JSON.stringify(results) } `);
            });
        },
        function (arg1, callback) {
          async.map(['/Users/wuhaifeng/develop/svn/shizi', '/Users/wuhaifeng/develop/code/ts/project'], fs.stat,
            function (err, results) {
              if (err) {
                // console.log(`error: ${ err } `);
                callback(err);
                return;
              }
              console.log('2222');
              callback(null, results);
              // console.log(`results: ${ JSON.stringify(results) } `);
            });
        }
      ], function (err, results) {
        if (err) {
          console.log(`error: ${err} `);
          return;
        }

        console.log('3333333');
        console.log(`results: ${JSON.stringify(results)} `);
      });
      console.log('xxxxxx');

      // async.applyEach([function (elem) {
      //   setTimeout(() => {
      //     console.log('hello: ', elem);
      //   }, 2000);
      //   console.log('1111');
      // }
      // ], '123', function (err) {
      //   if (err) {
      //     console.log(JSON.stringify(err));
      //     return;
      //   }
      //   console.log('applyEach ret ok');
      // });
      console.log('ok');
    }

    testFileDir() {


      //解析需要遍历的文件夹，我这以E盘根目录为例
      var filePath = path.resolve('/Users/wuhaifeng/develop/svn/shizi/trunk/策划文档');

      //调用文件遍历方法
      fileDisplay(filePath);

      /**
       * 文件遍历方法
       * @param filePath 需要遍历的文件路径
       */
      function fileDisplay(filePath) {
        //根据文件路径读取文件，返回文件列表
        fs.readdir(filePath, function (err, files) {
          if (err) {
            console.warn(err)
          } else {
            //遍历读取到的文件列表
            files.forEach(function (filename) {
              //获取当前文件的绝对路径
              var filedir = path.join(filePath, filename);
              //根据文件路径获取文件信息，返回一个fs.Stats对象
              fs.stat(filedir, function (eror, stats) {
                if (eror) {
                  console.warn('获取文件stats失败');
                } else {
                  var isFile = stats.isFile();//是文件
                  var isDir = stats.isDirectory();//是文件夹
                  if (isFile) {
                    console.log(filedir);
                  }
                  if (isDir) {
                    fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                  }
                }
              })
            });
          }
        });
      }

    }
  }

  /**
   * 所有单例的基类，做了单例的基础检查。所有子类最好都写一个getInstance的静态方法来获取
   * @author sodaChen
   * Date:2012-10-29
   */
  export class Singleton {

    /**
     *  这个是单例需要进行私有化
     */
    private constructor() {

    }
    //注意，Singleton是要替换成你自己实现的子类 这里没有实际的作用
    private static instance: Singleton;
    /**
     * 获取实例的静态方法实例
     * @return
     *
     */
    public static getInstance(): Singleton {
      if (!this.instance) {
        this.instance = new Singleton();
      }
      return this.instance;
    }

    public sayHello() {
      console.log("helo every one");
    }
  }

  export class UtilFileDir {

    /**
     *  这个是单例需要进行私有化
     */
    private constructor() {

    }
    //注意，UtilFileDir是要替换成你自己实现的子类 这里没有实际的作用
    private static instance: UtilFileDir;
    /**
     * 获取实例的静态方法实例
     * @return
     *
     */
    public static getInstance(): UtilFileDir {
      if (!this.instance) {
        this.instance = new UtilFileDir();
      }
      return this.instance;
    }

    public getDirFiles(dirName: string, callbk: (err, fileNames?: string[]) => void) {

      //参数有效性检查
      if (!dirName) {
        callbk(`para dirName: ${dirName} empty`);
        return;
      }

      let fileState = fs.statSync(dirName);
      if (!fileState.isDirectory()) {
        callbk(`para dirName: ${dirName} is not dir`);
        return;
      }

      let fileNames: string[] = [];
      fs.readdir(dirName, (err, fileDirs) => {
        if (err) {
          callbk(err);
          return;
        }

        async.each(fileDirs, (item, callback) => {
          let fileCompDir = path.join(dirName, item);
          if (fs.statSync(fileCompDir).isFile()) {
            if (item.endsWith('.xlsx'))
              fileNames.push(fileCompDir);
            // console.log('getDirFiles item: ', item);
          }

          callback();
        }, function (err) {
          if (err) {
            callbk(err);
            return;
          }

          callbk(null, fileNames);
        });
      });
    }
  }

}