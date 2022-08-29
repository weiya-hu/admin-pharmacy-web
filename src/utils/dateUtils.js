/**
 * 获取前后几年
 * @param type left：前一年，right：后一年
 * @param index 年数：number
 * @returns {number}
 */
export function lastYear(type,index){
    let now = new Date();
    let year = now.getFullYear(); /* 获取现在的年份 */
    if(type === 'left') {/* 前一年 */
        year = new Date(now.setFullYear(year-index)).getFullYear()
    }
    if(type === 'right') {/* 后一年 */
        year = new Date(now.setFullYear(year +index)).getFullYear()
    }
    let month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
    let day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
    return year+'-'+month+'-'+day+' 00:00:00'
}
