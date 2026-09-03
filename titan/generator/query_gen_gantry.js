
function getRandomDateWithinLastTwoMonths() {
	// 현재 날짜
	const currentDate = new Date();

	// 두 달 전 날짜 계산
	const twoMonthsAgo = new Date();
	twoMonthsAgo.setMonth(currentDate.getMonth() - 2);

	// 두 날짜 사이의 무작위 날짜 생성
	const randomTimestamp = Math.random() * (currentDate - twoMonthsAgo) + twoMonthsAgo.getTime();

	// 무작위 타임스탬프를 Date 객체로 변환
	return new Date(randomTimestamp);
}

function formatDate(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');  // 1월은 0부터 시작하므로 +1
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const fs = require('fs');

fs.writeFile('query_pallet.txt', '', 'utf8', (err) => {
  if (err) {
    console.error('파일 쓰기 실패:', err);
  } else {
    console.log('파일이 성공적으로 저장되었습니다.');
  }
});


function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}





for (let i = 0; i < 300; i++) {

const stackingId = rand(2881, 5440);
const warehouseId = 1;
const equipmentId = rand(1, 8);

const stdTypes = ['NX10001', 'NX10002', 'NX10003', 'NX10004', 'NX10005', 'NX10006', 'NX10007', 'NX10008']; 
const standardTypeNo = rand(0, 7);
const stdType = stdTypes[standardTypeNo];
const lv = rand(1, 20);


const query = `INSERT INTO pallet (warehouse_id, equipment_id, create_date, standard_type, level) VALUES (${warehouseId}, ${equipmentId}, '${formatDate(getRandomDateWithinLastTwoMonths())}', '${stdType}', ${lv});\n`;

// console.log(query);
fs.appendFile('query_pallet.txt', query, 'utf8', (err) => {
	if (err) {
		console.error('파일 추가 실패:', err);
	} else {
		console.log('파일에 데이터가 추가되었습니다.');
	}
});

}

// stacking_id => 2881 ~ 5440 무작위 생성
// warehouse_id => 1
// equipment_id => 1 ~ 8 무작위 생성
// 타이어규격 => NX10001 ~ NX10008 무작위 생성
// 적재레벨 => 1 ~ 8 무작위 생성


// INSERT INTO pallet (stacking_id, warehouse_id, equipment_id, standard_type, level) VALUES (2881, 1, 1, 'NX10001', 1);

// console.log("ㅋㅋㅋㅋㅋㅋㅋㅋㅋ");



// const maxCount = 320;
// const maxEqipCount = 8;
// // const maxWarehouseCount = 1;
// let eId = 1;
// while (eId <= maxEqipCount) {
// 	let bank = 1;
// 	let bay = 1;
// 	let level = 1;
// 	for (let i = 1; i <= maxCount; i++) {

// 		if (i == ((maxCount / 2) + 1)) {
// 			bank = 2;
// 			bay = 1;
// 			level = 1;
// 		}

// 		if (level > 8) {
// 			level = 1;
// 			bay ++;
// 		}
		
// 		const query = `INSERT INTO crane_cell (warehouse_id, equipment_id, bank, bay, level) VALUES (1, ${eId}, ${bank}, ${bay}, ${level});\n`;
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
