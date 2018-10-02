// Function to get anonymous_id from cookie
function getAnonymousId() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    if (document.cookie.match(/hk01_annonymous_id/)) {
        return (document.cookie.match(/hk01_annonymous_id=([\w\-]+)/)[1]);
    } else {
        var temp_uid = s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
        var d = new Date();
        d.setTime(d.getTime() + (3650 * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = "hk01_annonymous_id=" + temp_uid + ";" + expires +
            ";path=/;domain=." + window.location.host.match(/([^\.]+(\.[^\.]+)?)$/)[1];
        return (temp_uid);
    }
}

// Initialize the tracker client
var myTracker = new trackerClient({
    GA: {
        trackingId: ["UA-70981149-1", "UA-70981149-36", "UA-125354638-2"] // UA-125354638-2 is the profile for hk01data editorial team
    },
    Piwik: {
        trackingUrl: "https://track.hk01.com/v1web/piwik.php",  // replace with your piwik tracking url
        siteId: 5,  // replace with your piwik site ID
        userId: getAnonymousId(), // replace with user ID, should be same as MEMBER_ID/ANONYMOUS_ID
        isSPA: true // if the page is single page application
    }
}, false);

/* Config the selected article detail */
const page_path = "/\u793e\u6703\u65b0\u805e/240258/";
const author = "\u7c21\u6d69\u5fb7, \u6881\u9038\u98a8, \u856d\u8f1d\u6d69";  // 簡浩德 梁逸風 蕭輝浩
const channel = "\u793e\u6703\u65b0\u805e"; // 社會新聞
const section = "\u793e\u6703\u65b0\u805e"; // 社會新聞
const article_id = "240258";

function fireArticlePV(url) {
    try {
        // Send Pageview for article
        myTracker.pageView({
            GA: true,
            Piwik: false
        }, {
                1: author,
                2: section,
                3: channel,
                5: article_id
            }, "https://hk01.com/" + page_path, page_path);

        console.log("fire Article PV");
    }
    catch (err) {
        console.log(err.message);
    }

}

function fireMapPV(url) {
    try {
        myTracker.disableGA({
            'UA-70981149-1': true, // staging
            'UA-70981149-36': false, // data team
            'UA-125354638-2': true // hk01 data
        });

        // Send Pageview for Map
        myTracker.pageView({
            GA: true,
            Piwik: true
        }, {}, url, removehash(window.location.href).replace(window.location.origin, ''));

        myTracker.resetGAFlags();
        console.log("fire Map PV");
    }
    catch (err) {
        console.log(err.message);
    }

}

function fireEvent(cat, act, lab) {
    try {
        console.log(cat, act, lab);
        myTracker.fire(
            {
                GA: true,
                Piwik: true
            },
            {
                category: cat,
                action: act,
                label: JSON.stringify(lab),
                nonInteraction: false,
                customDimensions: {
                    //[DIMENSION_ARTICLE_AUTHOR]: "Eric"
                }
            }
        );
    }
    catch (err) {
        console.log(err.message);
    }
}

function removehash(string) {
    return string.replace("#", "/");
}

export {
    getAnonymousId,
    fireArticlePV,
    fireMapPV,
    fireEvent,
    removehash
}
