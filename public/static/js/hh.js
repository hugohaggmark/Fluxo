(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

function getGode() {
    var code = "VB.73454767.2",
        i,
        arr = code.split('');
    for (i = 0; i < arr.length; i++) {
        arr[i] = String.fromCharCode(arr[i].charCodeAt() - 1);
    }

    return arr.join('');
}

ga('create', getGode(), 'auto');
ga('send', 'pageview');
