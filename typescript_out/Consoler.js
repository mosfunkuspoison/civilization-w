var Consoler = (function () {
    function Consoler(DOM_element, maxc, maxl) {
        this.cons = [];
        this.DOM_element = DOM_element;
        this.maxcols = maxc;
        this.maxlines = maxl;
    }
    Consoler.prototype.print = function (t) {
        this.cons.push(t);
        console.log(t);
    };
    Consoler.prototype.println = function (t) {
        this.cons.push(t + "\r\n");
        console.log(t);
    };
    Consoler.prototype.save = function () {
        var saveData = "";
        var i = 0;
        for (i = 0; i < (this.cons.length); i++) {
            saveData += this.cons[i];
        }
        this.downloadText(saveData, "console.txt", "text/plain");
    };
    Consoler.prototype.downloadText = function (strData, strFileName, strMimeType) {
        var D = document, A = arguments, a = D.createElement("a"), d = A[0], n = A[1], t = A[2] || "text/plain";
        a.href = "data:" + strMimeType + "charset=utf-8," + encodeURI(strData);
        if ('download' in a) {
            a.setAttribute("download", n);
            a.innerHTML = "downloading...";
            D.body.appendChild(a);
            setTimeout(function () {
                var e = D.createEvent("MouseEvents");
                e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                a.dispatchEvent(e);
                D.body.removeChild(a);
            }, 66);
            return true;
        }
        ;
        var f = D.createElement("iframe");
        D.body.appendChild(f);
        f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : encodeURI)(strData);
        setTimeout(function () { D.body.removeChild(f); }, 333);
        return true;
    };
    return Consoler;
}());
