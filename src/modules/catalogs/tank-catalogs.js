const tankT80 = document.querySelector('#t-80');
const tankT72 = document.querySelector('#t-72');
const abrams = document.querySelector('#abrams');
const leopard = document.querySelector('#leopard');

const t80Info = document.querySelector('#t-80-info')
const t72Info = document.querySelector('#t-72-info')
const abramsInfo = document.querySelector('#abrams-info')
const leopardInfo = document.querySelector('#leopard-info')

const tankTabsList = [t72Info, t80Info, abramsInfo, leopardInfo]

const changeTankTab = (tab) => {
    for (let tankTab of tankTabsList) {
        if (tab === tankTab) {
            tab.style.display = 'flex'
        } else {
            tankTab.style.display = 'none'
        }
    }
}

tankT80.addEventListener('click', () => {
    changeTankTab(t80Info)
})

tankT72.addEventListener('click', () => {
    changeTankTab(t72Info)
})

abrams.addEventListener('click', () => {
    changeTankTab(abramsInfo)
})

leopard.addEventListener('click', () => {
    changeTankTab(leopardInfo)
})
