import React from 'react';
import ReactDOM from 'react-dom';

/**
 * @description useMemo
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

function useMemo(callback: () => any, deps?: any[]) {
    let currentIndex = hooksIndex;
    // 判断是否存在 useMemo hooks
    if (hooks[hooksIndex] && deps !== undefined) {
        // 取出缓存 useMemo hooks
        const [cacheState, cacheDeps] = hooks[currentIndex];
        // 对比依赖是否都相同
        const status = cacheDeps.every(
            (item: any, index: number) => item === deps[index]
        );
        hooksIndex += 1;
        if (status) {
            return cacheState;
        } else {
            const cache = callback();
            hooks[currentIndex] = [cache, deps];
            return cache;
        }
    } else {
        const cache = callback();
        hooks[currentIndex] = [cache, deps];
        return cache;
    }
}

const Child = (props: { number: number }) => {
    console.log('%c start update', 'color:red');
    return (
        <p>验证 useMemo: {props.number}</p>
    );
};
const MemoChild = React.memo(Child);

const App = () => {
    const [number, setnumber] = useState(0);
    const [number2, setNumber2] = useState(0);
    const cacheNumber = useMemo(() => number,[number]);
    const handleClick = () => setnumber(number + 1);
    const handleClick2 = () => setNumber2((number: number) => number + 1);
    return (
        <React.Fragment>
            <h1>useMemo</h1>
            <p>number 1: {number}</p>
            <p>number 2: {number2}</p>
            <MemoChild number={cacheNumber} />
            <button onClick={handleClick}>点我看是否触发子组件的更新 1</button>
            <button onClick={handleClick2}>点我看是否触发子组件的更新 2</button>
        </React.Fragment>
    );
};
function render() {
    console.log(hooks);
    ReactDOM.render(<App />, document.getElementById('root'));
}
export default render;

