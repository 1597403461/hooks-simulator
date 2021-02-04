import React from 'react';
import ReactDOM from 'react-dom';

/**
 * @description useEffect
 */
// 创建数组存储 state
let hooks: any[] = [];
// 定义 index
let hooksIndex = 0;
function useState(initialState: any) {
    // 存储当前的 state 对应的 index
    let currentIndex = hooksIndex;
    // 初始化 state 值
    hooks[currentIndex] = hooks[currentIndex] || initialState;
    // 修改 state 的函数
    const setState = (newState: any) => {
        let returnState;
        if (typeof newState === 'function') {
            returnState = newState(hooks[currentIndex]);
        } else {
            returnState = newState;
        }
        // 赋值
        hooks[currentIndex] = returnState;
        // 每一次 setState 重新 render， 初始化 hooksIndex
        hooksIndex = 0;
        // 每次修改 state 值， 都需要重新渲染页面
        render();
    };
    // 自增为存储下一个 state 做准备
    hooksIndex += 1;
    // 返回
    return [hooks[currentIndex], setState];
}

function useEffect(callback: () => any, deps: any[]) {
    let currentIndex = hooksIndex;
    // 判断是否存在 useEffect hooks
    if (hooks[currentIndex]) {
        // 取出缓存 effect hooks
        const [cacheDestroy, cacheDeps] = hooks[currentIndex];
        // 对比依赖是否都相同
        const status = cacheDeps.every(
            (item: any, index: number) => item === deps[index]
        );
        if (!status) {
            cacheDestroy && cacheDestroy();
            let destroy = callback();
            hooks[currentIndex] = [destroy, deps];
        }
        hooksIndex += 1;
    } else {
        let destroy = callback();
        hooksIndex += 1;
        hooks[currentIndex] = [destroy, deps];
    }
}

const App = () => {
    const [number, setnumber] = useState(0);
    const [number2, setNumber2] = useState(0);
    useEffect(() => {
        document.title = number;
    },[number])
    const handleClick = () => setnumber(number + 1);
    const handleClick2 = () => setNumber2((number: number) => number + 1);
    return (
        <React.Fragment>
            <h1>useEffect</h1>
            <p>number 1: {number}</p>
            <p>number 2: {number2}</p>
            <button onClick={handleClick}>click change number 1</button>
            <button onClick={handleClick2}>click change number 2</button>
        </React.Fragment>
    );
};
function render() {
    ReactDOM.render(<App />, document.getElementById('root'));
    console.log('%c hooks: ', 'color:yellow', hooks);
}

export default render;

