function arrayContains(arr, n) {
    for (var i in arr) {
        if (arr[i] === n)
            return true;
    }
    return false;
}
function padTwoDigitNum(n) {
    if (n <= 0)
        return '  ';
    else if (n < 10)
        return ' ' + n;
    else
        return '' + n;
}
function arrayIntersection(a, b) {
    var ai = 0, bi = 0;
    var result = new Array();
    while (ai < a.length && bi < b.length) {
        if (a[ai] < b[bi]) {
            ai++;
        }
        else if (a[ai] > b[bi]) {
            bi++;
        }
        else {
            result.push(a[ai]);
            ai++;
            bi++;
        }
    }
    return result;
}
