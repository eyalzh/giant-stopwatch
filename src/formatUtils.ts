
export function zeroPadNum(num: number, maxLength: number): string {
    return num.toString().padStart(maxLength, "0");
}