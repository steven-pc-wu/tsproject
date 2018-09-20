import {Util as Ul} from './core/utils';
// import * as Ul from './core/utils'

/**
 * main 入口
 * 
 * 测试
 */
function main() {
    const tester = new Ul.NodeModuleTester("s1", 1);

    console.log(Ul.NodeModuleTester.STATIC_VAR);
    console.log(Ul.NodeModuleTester.testPath());
    console.log("hello steven112289456123");
    tester.sayHello();

    let mod = new Ul.Module();
    mod.SayHi();

    Ul.Singleton.getInstance().sayHello();

}

main();