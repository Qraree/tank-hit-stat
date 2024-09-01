function throttle(callee, timeout) {
    let timer = null

    return function perform(...args) {
        if (timer) return

        timer = setTimeout(() => {
            callee(...args)

            clearTimeout(timer)
            timer = null
        }, timeout)
    }
}

const addTwoArrays = (a, b) => {
    if (a.length === 0 || b.length === 0) {
        return a.length === 0 ? b : a
    }

    return a.map((e, i) => e + b[i])
}

const range = function(start, stop, step){
    step = step || 1;
    const arr = [];
    for (let i=start;i<stop;i+=step) {
        arr.push(i);
    }
    return arr;
};



module.exports = { throttle, addTwoArrays, range }