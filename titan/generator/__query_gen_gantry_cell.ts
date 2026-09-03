import * as fs from 'fs';

fs.writeFile('query_gantry_cell.txt', '', 'utf8', (err) => {
  if (err) {
    console.error('파일 쓰기 실패:', err);
  } else {
    console.log('파일이 성공적으로 저장되었습니다.');
  }
});



console.log("ㅋㅋㅋㅋㅋㅋㅋㅋㅋ");



const maxBankCount = 8;
const maxBayCount = 20;
const maxLevelCount = 8;
const warehouseId = 1;
const maxEquidId = 4;
let bank = 1;
let bay = 1;
let level = 1;
let eId = 1;

while (true) {

	const query = `INSERT INTO gantry_cell (warehouse_id, equipment_id, bank, bay, level) VALUES (${warehouseId}, ${eId}, ${bank}, ${bay}, ${level});\n`;
	// console.log(query);
	fs.appendFile('query_gantry_cell.txt', query, 'utf8', (err) => {
		if (err) {
			console.error('파일 추가 실패:', err);
		} else {
			console.log('파일에 데이터가 추가되었습니다.');
		}
	});

	level ++;
	if (level > maxLevelCount) {	
		level = 1;
		bay++;
	}

	if (bay > maxBayCount) {
		bay = 1;	
		bank++;	
	}

	if (bank > maxBankCount) {
		bank = 1;
		eId++;
	}

	if (eId > maxEquidId) {
		break;
	}	
}


// // const maxWarehouseCount = 1;
// let eId = 1;
// while (eId <= maxEqipCount) {
// 	let bank = 1;
// 	let bay = 1;
// 	let level = 1;
// 	for (let i = 1; i <= maxCount; i++) {

// 		if (i == 40) {
// 			bank ++;
// 			bay = 1;
// 			level = 1;
// 		}

// 		if (level > 8) {
// 			level = 1;
// 			bay ++;
// 		}
		
// 		const query = `INSERT INTO gantry_cell (warehouse_id, equipment_id, bank, bay, level) VALUES (1, ${eId}, ${bank}, ${bay}, ${level});\n`;
// 		level ++;

// 		// console.log(query);

// 		fs.appendFile('query.txt', query, 'utf8', (err) => {
// 			if (err) {
// 				console.error('파일 추가 실패:', err);
// 			} else {
// 				console.log('파일에 데이터가 추가되었습니다.');
// 			}
// 		});
		

		
// 	}
// 	eId ++;
// }
