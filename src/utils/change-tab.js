const analyticsTab = document.querySelector('#analytics-mode');
const monteCarloTab = document.querySelector('#monte-carlo-mode');
const battleTab = document.querySelector('#battle-mode');
const tanksTab = document.querySelector('#tanks-list-mode');
const otherTab = document.querySelector('#other-mode');
const settingsTab = document.querySelector('#settings-mode');

const monteCarloPlots = document.querySelector('#monte-carlo-plots');
const analyticsPlots = document.querySelector('#analytics-plots');
const battlePlots = document.querySelector('#battle-plots');
const tanksList = document.querySelector('#tanks-list');
const otherPlots = document.querySelector('#other-plots');
const settings = document.querySelector('#settings');

const MAIN_COLOR = '#333D79FF';
const SECONDARY_COLOR = '#FAEBEFFF';

const tabsArray = [
    {
        tab: analyticsTab,
        plot: analyticsPlots,
    },
    {
        tab: monteCarloTab,
        plot: monteCarloPlots,
    },
    {
        tab: battleTab,
        plot: battlePlots,
    },
    {
        tab: tanksTab,
        plot: tanksList,
    },
    {
        tab: otherTab,
        plot: otherPlots,
    },
    {
        tab: settingsTab,
        plot: settings,
    }
];

const changeTab = (tab_value) => {

    for (let tab of tabsArray) {
        if (tab.tab === tab_value) {
            tab.tab.style.backgroundColor = 'white';
            tab.tab.style.color = MAIN_COLOR;
            tab.plot.style.display = 'flex';
        } else {
            tab.tab.style.backgroundColor = MAIN_COLOR;
            tab.tab.style.color = 'white';
            tab.plot.style.display = 'none';
        }
    }
}



analyticsTab.addEventListener('click', () => changeTab(analyticsTab))
monteCarloTab.addEventListener('click', () => changeTab(monteCarloTab))
battleTab.addEventListener('click', () => changeTab(battleTab))
tanksTab.addEventListener('click', () => changeTab(tanksTab))
otherTab.addEventListener('click', () => changeTab(otherTab))
settingsTab.addEventListener('click', () => changeTab(settingsTab))