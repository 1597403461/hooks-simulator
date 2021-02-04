import useState from './useState';
import useCallback from './useCallback';
import useEffect from './useEffect';
import useMemo from './useMemo';
import useReducer from './useReducer';

interface IAnyObject {
    [key: string]: any
}

const obj:IAnyObject = {
    useState,
    useCallback,
    useEffect,
    useMemo,
    useReducer
}

function render(arg: string) {
    obj[arg]()
}

render('useState')
// render('useCallback')
// render('useEffect')
// render('useMemo')
// render('useReducer')