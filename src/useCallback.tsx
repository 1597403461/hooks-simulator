import React from 'react';
import ReactDOM from 'react-dom';

/**
 * @description useCallback
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

function useCallback(callback: () => any, deps?: any[]) {
    let currentIndex = hooksIndex;
    // 判断是否存在 useCallback hooks,不存在的话，创建新的hooks
    if (hooks[currentIndex] && deps !== undefined) {
        // 取出缓存 useCallback hooks
        const [cacheCallback, cacheDeps] = hooks[currentIndex];
        // 对比依赖是否都相同
        const status = cacheDeps.every(
            (item: any, index: number) => item === deps[index]
        );
        // 自增 hooksIndex ,为下一个 hooks 作准备
        hooksIndex += 1;
        // 如果依赖相同，返回缓存的函数
        if (status) {
            return cacheCallback;
        } else {
            // 否则重新赋值
            hooks[currentIndex] = [callback, deps];
            return callback;
        }
    } else {
        hooks[currentIndex] = [callback, deps];
        // 自增 hooksIndex ,为下一个 hooks 作准备
        hooksIndex += 1;
        return callback;
    }
}

const Btn = (props: {onclick: () => any }) => {
    console.log('%c start update', 'color:red');
    return (
        <button onClick={props.onclick}>验证 useCallback</button>
    );
};
const MemoBtn = React.memo(Btn);

const App = () => {
    const [number, setnumber] = useState(0);
    const [number2, setNumber2] = useState(0);
    const handleClick = useCallback(() => setnumber(number + 1), [number]);
    const handleClick2 = () => setNumber2((number: number) => number + 1);
    return (
        <React.Fragment>
            <h1>useCallback</h1>
            <p>number 1: {number}</p>
            <p>number 2: {number2}</p>
            <button onClick={handleClick2}>点我看是否触发子组件的更新 2</button>
            <MemoBtn onclick = {handleClick}/>
        </React.Fragment>
    );
};
function render() {
    ReactDOM.render(<App />, document.getElementById('root'));
    console.log('%c hooks: ', 'color:yellow', hooks);
}

export default render;

