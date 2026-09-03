export const equipMap = { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4 }
export const stdTypes = ['NX10001', 'NX10002', 'NX10003', 'NX10004', 'NX10005', 'NX10006', 'NX10007', 'NX10008']; 

export function getRandomDateWithinLastTwoMonths() {
	// 현재 날짜
	const currentDate: any = new Date();

	// 두 달 전 날짜 계산
	const twoMonthsAgo: any = new Date();
	twoMonthsAgo.setMonth(currentDate.getMonth() - 2);

	// 두 날짜 사이의 무작위 날짜 생성
	const randomTimestamp = Math.random() * (currentDate - twoMonthsAgo) + twoMonthsAgo.getTime();

	// 무작위 타임스탬프를 Date 객체로 변환
	return new Date(randomTimestamp);
}

export function getRandomDateWithinLastYear() {
	// 현재 날짜
	const currentDate: any = new Date();

	// 두 달 전 날짜 계산
	const yearAgo: any = new Date();
	yearAgo.setYear(currentDate.getFullYear() - 2);

	// 두 날짜 사이의 무작위 날짜 생성
	const randomTimestamp = Math.random() * (currentDate - yearAgo) + yearAgo.getTime();

	// 무작위 타임스탬프를 Date 객체로 변환
	return new Date(randomTimestamp);
}

export function formatDate(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');  // 1월은 0부터 시작하므로 +1
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function convertRawToArrayWithComma(raw: string) {
	const arr = raw.split(',').map(type =>type.trim());
	return arr;
}

export function convertRawToArray(raw: string) {
	const arr = raw.split(',').map(type => type.trim());
	return arr;
}

export function getDateOneYearAgo(startDate: Date): Date {
	startDate.setDate(startDate.getDate() - 365);
	return startDate; // YYYY-MM-DD 형식 반환
}