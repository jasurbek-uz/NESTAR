// ZS-TASK:

// Shunday function yozing, u parametridagi arrayni ichidagi 1 marta kelgan elemnetni qaytarsin.
// MASALAN: singleNumber([4, 2, 1, 2, 1]) return 4

function singleNumber(nums) {
  let result = 0;
  for (let num of nums) {
    result ^= num; 
  }
  return result;
}

console.log(singleNumber([4, 2, 1, 2, 1])); 


























// ZQ-TASK:

// Shunday function yozing, u parametridagi array ichida 2 marta qaytarilgan sonlarni alohida araryda qaytarsin.
// MASALAN: findDuplicates([1,2,3,4,5,4,3,4]) return [3, 4]

// function findDuplicates(arr: number[]): number[] {
// 	return arr.filter((num, i) => arr.indexOf(num) !== i);
// }

// console.log(findDuplicates([1, 2, 3, 4, 5, 4, 3, 4]));

// ZP-TASK:

// shunday function yozing, u 2 ta array parametr qabul qilsin.
// Siz bu ikki arrayning qiymatlari o'xshash bo'lishini(ya'ni, ularning barcha elementlari bir xil bo'lishini) tekshirishingiz kerak.

// MASALAN:
// console.log(areArraysEqual([1, 2, 3], [3, 1, 2])) // true
// console.log(areArraysEqual([1, 2, 3], [3, 1, 2, 1])) // true
// console.log(areArraysEqual([1, 2, 3], [4, 1, 2])) // false

// function areArraysEqual(arr1, arr2) {
// 	if (arr1.length !== arr2.length) return false;

// 	for (let i = 0; i < arr1.length; i++) {
// 		if (arr1[i] !== arr2[i]) return false;
// 	}

// 	return true;
// }

// ZO-TASK:

// Shunday function yozing, u parametrdagi string ichidagi qavslar miqdori balansda
// ekanligini aniqlasin. Ya'ni ochish("(") va yopish(")") qavslar soni bir xil bolishi kerak.
// MASALAN: areParenthesesBalanced("string()ichida(qavslar)soni()balansda") return true

// function areParenthesesBalanced(input) {
// 	let balance = 0;

// 	for (let char of input) {
// 		if (char === '(') balance++;
// 		else if (char === ')') {
// 			balance--;
// 			if (balance < 0) return false;
// 		}
// 	}

// 	return balance === 0;
// }

// console.log(areParenthesesBalanced("()()")); // true

// ZN-TASK:

// Shunday function yozing, uni array va number parametri bolsin.
//Ikkinchi parametrda berilgan raqamli indexgacha arrayni orqasiga ogirib qaytarsin.
// MASALAN: rotateArray([1, 2, 3, 4, 5, 6], 3) return [5, 6, 1, 2, 3, 4]

// function rotateArray(arr, index) {
// 	const n = arr.length;
// 	index %= n;

// 	return arr.slice(index).concat(arr.slice(0, index));
// }

// console.log(rotateArray([1, 2, 3, 4, 5, 6], 2));

// ZM-TASK:

// Shunday function yozing, u function parametrga berilgan raqamlarni orqasiga ogirib qaytarsin.
// MASALAN: reverseInteger(123456789) return 987654321

// function reverseInteger(num) {
// 	return Number(num.toString().split('').reverse().join(''));
// }

// ZL-TASK:

// Shunday function yozing, u parametrda berilgan stringni kebab casega otkazib qaytarsin. Bosh harflarni kichik harflarga ham otkazsin.
// MASALAN: stringToKebab(“I love Kebab”) return “i-love-kebab”
// function stringToKebab(str) {
// 	return str
// 		.split('')
// 		.map((char, i) => (i > 0 && char === char.toUpperCase() ? `-${char.toLowerCase()}` : char.toLowerCase()))
// 		.join('')
// 		.replace(/\s+/g, '-');
// }
// console.log(stringToKebab("I love Kebab"))

// function printNumbers() {
// 	for (let number = 1; number <= 5; number++) {
// 		setTimeout(
// 			() => {
// 				console.log(number);
// 			},
// 			(number - 1) * 1000,
// 		);
// 	}
// }

// printNumbers();

/* 
ZJ-TASK:

Shunday function yozing, u berilgan arrayni ichidagi numberlarni qiymatini hisoblab qaytarsin.
MASALAN: reduceNestedArray([1, [1, 2, [4]]]) return 8
*/

// function sumArray(arr) {
//   return arr.flat(Infinity).reduce((sum, num) => sum + num, 0);
// }

// console.log(sumArray([1, [1, 2, [4]]]));
