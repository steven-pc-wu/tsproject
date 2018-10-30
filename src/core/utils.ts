import * as path from 'path';                     // 测试能否正常使用 Node 的内置模块
import * as _ from 'lodash';

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

    testFor() {
      console.log("tesıtFor");
      let array = [1, 'steven', 2];
      for (const value of array) {
        console.log(value);
      }
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

}

