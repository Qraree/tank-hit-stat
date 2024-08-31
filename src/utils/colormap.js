const colormap_array = (lowEnd, highEnd, child = false) => {
    const list = [];
    for (let i = lowEnd; i <= highEnd; i++) {
        list.push(child ? i : colormap_array(lowEnd + i, highEnd + i, true));
    }
    return list
}

module.exports = { colormap_array }