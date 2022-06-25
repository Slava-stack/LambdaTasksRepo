// const { promisify } = require('util')
// const readFile = promisify(fs.readFile);
import fs from 'fs';
import {json} from "express";


export function decIpToIp(decIp) {
    const NUMBER_OCTETS_POS = [[-32, -24], [-24, -16], [-16, -8], [-8]];
    let arr = [];
    const binIp = decIp.toString(2);
    NUMBER_OCTETS_POS.forEach(([firstPos, secondPos]) =>
        arr.push(parseInt(binIp.slice(firstPos, secondPos), 2)))
    return arr.join('.');
}
export function ipToDecIp(ip) {
    let octetArr = [];
    ip.split('.').forEach(el =>
        octetArr.push(
            '0'.repeat(8 - (+el).toString(2).length) + (+el).toString(2)
        )
    )
    return parseInt(octetArr.join(''), 2);
}
export function findIpRowAccordingDecIp(rows, decIp){
    let jsonRow;
    for( let el of rows.toString().split('\n')){
        const ipRangeRegardingCountry = el.split(',');
        if (decIp >= ipRangeRegardingCountry[0] && decIp <= ipRangeRegardingCountry[1]) {
            jsonRow = {
                country: ipRangeRegardingCountry[3].replace('\r', ''),
                countryCode: ipRangeRegardingCountry[2],
                ipRangeStart: (decIpToIp(+ipRangeRegardingCountry[0]).includes('NaN')) ?
                    '-' : decIpToIp(+ipRangeRegardingCountry[0]),
                ipRangeEnd: (decIpToIp(+ipRangeRegardingCountry[1]).includes('NaN')) ?
                    '-' : decIpToIp(+ipRangeRegardingCountry[1]),
            };
            break;
        }
    }
    return jsonRow
}
