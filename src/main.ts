import {Util} from './core/utils';

/**
 * main 入口
 * 
 * 测试
 */
function main() {
    const tester = new Util.NodeModuleTester("s1", 1);

    console.log(Util.NodeModuleTester.STATIC_VAR);
    console.log(Util.NodeModuleTester.testPath());
    console.log("hello steven1122");
    tester.sayHello();
}

main();