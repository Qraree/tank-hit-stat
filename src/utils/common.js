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


module.exports = { throttle, addTwoArrays }