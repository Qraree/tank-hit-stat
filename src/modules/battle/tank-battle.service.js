const { tableTankData, tableAtgmData, defaultTankColumns, defaultAtgmColumns } = require('../../constants/default-table-columns')
const { makeid } = require('../../utils/make-id')

class TankBattleService {
    landscapesTank = ['firstTank', 'secondTank', 'thirdTank', 'forthTank', 'fifthTank', 'sixTank', 'sevenTank', 'eightTank'];
    landscapesAtgm = ['firstAtgm', 'secondAtgm', 'thirdAtgm', 'forthAtgm', 'fifthAtgm', 'sixAtgm', 'sevenAtgm', 'eightAtgm'];
    
    constructor(
        atgmReloadInput, 
        atgmAimingInput ,
        atgmMissileNumberInput,
        atgmMissileSpeedInput,
        tankReloadInput,
        tankAimingInput,
        tankProjectileSpeedInput,
        tankReactionInput,
        battleTankTable,
        battleAtgmTable,
    ) {

        this.atgmReloadInput = atgmReloadInput;
        this.atgmAimingInput = atgmAimingInput;
        this.atgmMissileNumberInput = atgmMissileNumberInput;
        this.atgmMissileSpeedInput = atgmMissileSpeedInput;
        this.tankReloadInput = tankReloadInput;
        this.tankAimingInput = tankAimingInput;
        this.tankProjectileSpeedInput = tankProjectileSpeedInput;
        this.tankReactionInput = tankReactionInput;

        this.atgmReloadInput.value = 15;
        this.atgmAimingInput.value = 5;
        this.atgmMissileNumberInput.value = 4;
        this.atgmMissileSpeedInput.value = 200;
        this.tankReloadInput.value = 8;
        this.tankAimingInput.value = 5;
        this.tankProjectileSpeedInput.value = 800;
        this.tankReactionInput.value = 2;

        this.tankTableData = new Tabulator(battleTankTable, {
            data:tableTankData,
            columns: defaultTankColumns,
        });
        
        this.atgmTableData = new Tabulator(battleAtgmTable, {
            data:tableAtgmData,
            columns: defaultAtgmColumns,
        });
    }

    makeOutcomeTable() {

        const atgmTable = this.getDataFromTable(this.atgmTableData, 'Atgm');
        const tankTable = this.getDataFromTable(this.tankTableData, 'Tank');

        let outcomeTable = {};
    
        let X = [];
        let Y = [];
        let Z = [];
    
        for (let tankProperty in tankTable) {
            outcomeTable[tankProperty] = {};
            for (let valueProperty in tankTable[tankProperty]) {
                let outcome = this.calculateBattle(atgmTable[tankProperty][valueProperty], tankTable[tankProperty][valueProperty], Number(valueProperty), Number(tankProperty));
                X.push(Number(tankProperty));
                Y.push(Number(valueProperty));
                outcomeTable[tankProperty][valueProperty] = outcome;
    
            }
        }
    
        for (let outcomeProperty in outcomeTable['1']) {
            for (let outcomeFirstProperty in outcomeTable) {
                Z.push(outcomeTable[outcomeFirstProperty][outcomeProperty])
            }
        }
    
        return [X, Y, Z]
    }

    calculateBattle (atgmProbability=0.2, tankProbability=0.2, distance=500) {

        let time = -0.1;
        let atgmMissileNumber = Number(this.atgmMissileNumberInput.value)
    
        let confidenceProbabilityAtgm = 0;
        let confidenceProbabilityTank = 0;
    
        let probabilityValueAtgm = atgmProbability;
        let probabilityValueTank = tankProbability;
    
        let atgmMissileSpeed = Number(this.atgmMissileSpeedInput.value);
        let tankProjectileSpeed = Number(this.tankProjectileSpeedInput.value);
    
        let atgmReloadTime = Number(this.atgmReloadInput.value) + Number(this.atgmAimingInput.value);
        let tankReloadTime = Number(this.tankReloadInput.value) + Number(this.tankAimingInput.value);
    
    
        let atgmReload = atgmReloadTime + 1;
        let tankReload = tankReloadTime + 1;
    
        let atgmFire = false;
        let tankFire = false;
    
        let atgmMissileFlightTime = distance / atgmMissileSpeed;
        let tankProjectileFlightTime = distance / tankProjectileSpeed;
    
        let atgmMissileFlight = 0;
        let tankProjectileFlight = 0;
    
        let firstMissileHit = false;
        let tankReactionTime = Number(this.tankReactionInput.value);
        let tankReactionTimer = false;
    
        let step = 0.1;
    
        while (true) {
            time += step;
            time = Math.round(time * 100) / 100;
    
    
            if (tankReactionTimer) {
                tankReactionTime -= step;
            }
    
            if (atgmReload >= atgmReloadTime && atgmFire === false && atgmMissileNumber !== 0) {
                atgmMissileNumber -= 1;
                atgmFire = true;
                atgmReload = 0;
                atgmMissileFlight = 0;
            } else {
                if (atgmFire === false) {
                    atgmReload += step;
                }
            }
    
            if (firstMissileHit === true && tankReactionTime <= 0) {
                if (tankReload >= tankReloadTime && tankFire === false) {
                    tankFire = true;
                    tankReactionTimer = false;
                    tankReload = 0;
                    tankProjectileFlight = 0;
                } else {
                    if (tankFire === false) {
                        tankReload += step;
                    }
                }
            }
    
            if (atgmFire) {
                if (atgmMissileFlight >= atgmMissileFlightTime) {
    
                    if (firstMissileHit === false) {
                        firstMissileHit = true;
                        tankReactionTimer = true;
                    }
    
                    if (atgmMissileNumber === 0) {
                        return 0
                    }
    
                    atgmFire = false;
                    confidenceProbabilityAtgm += probabilityValueAtgm;
    
                } else {
                    atgmMissileFlight += step;
                    atgmReload += step;
                }
            }
    
            if (tankFire) {
                if (tankProjectileFlight >= tankProjectileFlightTime) {
                    tankFire = false;
                    confidenceProbabilityTank += probabilityValueTank;
                } else {
                    tankProjectileFlight += step;
                    tankReload += step;
                }
            }
    
            if (confidenceProbabilityAtgm >= 0.95 && confidenceProbabilityTank >= 0.95) {
                return 0
            }
    
            if (confidenceProbabilityAtgm >= 0.95) {
                if (tankProjectileFlight >= tankProjectileFlightTime) {
                    return 1
                }
                return 1
            }
    
            if (confidenceProbabilityTank >= 0.95) {
                if (atgmMissileFlight >= atgmMissileFlightTime) {
                    return -1
                }
                return -1
            }
    
        }
    }

    getDataFromTable(table, mode) {
        let data = table.getData();
        let result = {}
        let landscapes = mode === 'Tank' ? this.landscapesTank : this.landscapesAtgm
        for (let landscape of landscapes) {
            if (data['0'][`${landscape}`] !== "") {
                result[`${data['0'][`${landscape}`]}`] = {}
            }
        }
    
    
        for (let property in data) {
            if (property !== "0") {
                let i = -1;
                for (let resultProperty in result) {
                    i++;
                    if (Number(data[property][landscapes[i]]) === 0) {
                        continue
                    }
                    result[resultProperty][data[property][`distance${mode}`]] = Number(data[property][landscapes[i]]);
                }
            }
        }
    
        return result
    }

    addColumnToTable() {
        let newTankStringField = makeid(6);
        let newAtgmStringField = makeid(6);


        tankTable.addColumn({title:"-", field:newTankStringField, editor: "input"}, false);
        atgmTable.addColumn({title:"-", field:newAtgmStringField, editor: "input"}, false);
    }
}

module.exports = { TankBattleService }