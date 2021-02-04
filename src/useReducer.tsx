import React from 'react';
import ReactDOM from 'react-dom';

/**
 * @description useReducer
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

// useReducer
function useReducer(
    reducer: (state: any, action: { type: string }) => unknown,
    initialState: any
) {
    let currentIndex = hooksIndex;
    hooks[currentIndex] = hooks[currentIndex] || initialState;
    const dispatch = (action: { type: string }) => {
        hooks[currentIndex] = reducer(hooks[currentIndex], action);
        hooksIndex = 0;
        render();
    };
    hooksIndex += 1;
    return [hooks[currentIndex], dispatch];
}

function reducer(state: any, action: { type: string }) {
    switch (action.type) {
        case 'add':
            return state + 1;
        case 'decrease':
            return state - 1;
        default:
            return state;
    }
}
const App = () => {
    const [number, dispatch] = useReducer(reducer, 0);
    const [number2, setnumber2] = useState(0);
    const handleClick= () => setnumber2((number: number) => number + 1);
    const handleClickAdd = () => dispatch({ type: 'add' });
    const handleClickDecrease = () => dispatch({ type: 'decrease' });
    return (
        <React.Fragment>
            <h1>useReducer</h1>
            <p>number useReducer: {number}</p>
            <button onClick={handleClickAdd}>useReducer add</button>
            <button onClick={handleClickDecrease}>useReducer decrease</button>
            <p>number useState: {number2}</p>
            <button onClick={handleClick}>useState 修改 state</button>
        </React.Fragment>
    );
};
function render() {
    ReactDOM.render(<App />, document.getElementById('root'));
    console.log('%c hooks: ', 'color:yellow', hooks);
}

export default render;
