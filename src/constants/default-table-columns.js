let tableTankData = [
    {distanceTank:'', firstTank:"1", secondTank:'2', thirdTank:'3', forthTank: '', fifthTank: '', sixTank: '', sevenTank: '', eightTank: ''},
    {distanceTank:'500', firstTank:"0.59", secondTank:'0.42', thirdTank:"0.33", forthTank: '', fifthTank: '', sixTank: '', sevenTank: '', eightTank: ''},
    {distanceTank:'1000', firstTank:"0.34", secondTank:'0.23', thirdTank:"0.16", forthTank: '', fifthTank: '', sixTank: '', sevenTank: '', eightTank: ''},
    {distanceTank:'1500', firstTank:"0.1", secondTank:'0.06', thirdTank:"0.04", forthTank: '', fifthTank: '', sixTank: '', sevenTank: '', eightTank: ''},
    {distanceTank:'2000', firstTank:"0.02", secondTank:'0.012', thirdTank:"0.008", forthTank: '', fifthTank: '', sixTank: '', sevenTank: '', eightTank: ''},
];

let tableAtgmData = [
    {distanceAtgm:'', firstAtgm:"1", secondAtgm:'2', thirdAtgm:'3', forthAtgm: '', fifthAtgm: '', sixAtgm: '', sevenAtgm: '', eightAtgm: ''},
    {distanceAtgm:'500', firstAtgm:"", secondAtgm:'', thirdAtgm:"", forthAtgm: '', fifthAtgm: '', sixAtgm: '', sevenAtgm: '', eightAtgm: ''},
    {distanceAtgm:'1000', firstAtgm:"", secondAtgm:'', thirdAtgm:"", forthAtgm: '', fifthAtgm: '', sixAtgm: '', sevenAtgm: '', eightAtgm: ''},
    {distanceAtgm:'1500', firstAtgm:"", secondAtgm:'', thirdAtgm:"", forthAtgm: '', fifthAtgm: '', sixAtgm: '', sevenAtgm: '', eightAtgm: ''},
    {distanceAtgm:'2000', firstAtgm:"", secondAtgm:'', thirdAtgm:"", forthAtgm: '', fifthAtgm: '', sixAtgm: '', sevenAtgm: '', eightAtgm: ''},
];

const defaultTankColumns = [
    {title: '-', field: 'distanceTank', editor: 'input'},
    {title: '-', field: 'firstTank', editor: 'input'},
    {title: '-', field: 'secondTank', editor: 'input'},
    {title: '-', field: 'thirdTank', editor: 'input'},
    {title: '-', field: 'forthTank', editor: 'input'},
    {title: '-', field: 'fifthTank', editor: 'input'},
    {title: '-', field: 'sixTank', editor: 'input'},
    {title: '-', field: 'sevenTank', editor: 'input'},
    {title: '-', field: 'eightTank', editor: 'input'},
]

const defaultAtgmColumns = [
    {title: '-', field: 'distanceAtgm', editor: 'input'},
    {title: '-', field: 'firstAtgm', editor: 'input'},
    {title: '-', field: 'secondAtgm', editor: 'input'},
    {title: '-', field: 'thirdAtgm', editor: 'input'},
    {title: '-', field: 'forthAtgm', editor: 'input'},
    {title: '-', field: 'fifthAtgm', editor: 'input'},
    {title: '-', field: 'sixAtgm', editor: 'input'},
    {title: '-', field: 'sevenAtgm', editor: 'input'},
    {title: '-', field: 'eightAtgm', editor: 'input'},
]

module.exports = { tableTankData, tableAtgmData, defaultTankColumns, defaultAtgmColumns }