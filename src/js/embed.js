import iframeMessenger from 'guardian/iframe-messenger'
import embedHTML from './text/embed.html!text'
import noUiSlider from 'nouislider'
import detect from './detect'

var firstClick = true;

var properties = {};

var intervalCheck;

var sld;

var containerEl, interactiveType;

window.init = function init(el, config) {

    containerEl = el;


    iframeMessenger.enableAutoResize();

    el.innerHTML = embedHTML;

    var metadata = document.location.search;

    //metadata = "mobile_before=//media.guim.co.uk/8a6284c68dc1bdaaa8d13f930b1d588679091f8d/0_0_4264_4301/496.jpg&desktop_before=//media.guim.co.uk/8a6284c68dc1bdaaa8d13f930b1d588679091f8d/0_0_4264_4301/991.jpg&label_before=Then&amp;mobile_after=//media.guim.co.uk/bf1ab4640975691dc677a79e89fe36757ceb2231/0_0_4264_4301/496.jpg&mobile_after=//media.guim.co.uk/bf1ab4640975691dc677a79e89fe36757ceb2231/0_0_4264_4301/991.jpg&desktop_after=//media.guim.co.uk/bf1ab4640975691dc677a79e89fe36757ceb2231/0_0_4264_4301/991.jpg&desktop_after=//media.guim.co.uk/bf1ab4640975691dc677a79e89fe36757ceb2231/0_0_4264_4301/991.jpg&label_after=Now&analytics_label=Berkley%20Square%20-%20Summer%20of%20Love%20Sliders%20-%2050%20years&";
    properties = {};

    if (metadata) {
        metadata.replace('?', '').split('&').forEach(function(property) {
            properties[property.split('=')[0]] = property.split(/=(.+)/)[1];
            
        })
    }

    //console.log(properties);

    interactiveType = properties["type"] || "fader";

    if (properties.label_before == undefined) {
        properties.label_before = "";
    }

    if (properties.label_after == undefined) {
        properties.label_after = "";
    }

    if ((properties.override == undefined || properties.override == "")  && (properties.disable_anim == undefined || properties.disable_anim == "")) {

        iframeMessenger.getLocation(checkAndroidApp);

    } else {
        buildApp( containerEl );
        startWidget();
    }

    // buildApp( containerEl ); // Uncomment if testing locally


    }; // end window.init;


    //interactiveType = "duo";
    //interactiveType = "slider";
    //interactiveType = "fader";

    function reinstateChars( imgUrl ) {
        //console.log(imgUrl);
        var newImgUrl = imgUrl.replace("----", "?");
        newImgUrl = newImgUrl.replace(/____/g, '&');
        console.log(newImgUrl);
        return newImgUrl;

    }

    function buildApp( el ) {


    el.querySelector('#interactive-now-and-then-container').classList.add(interactiveType);


    var elWidth = el.getBoundingClientRect().width;
    var isMobile = elWidth < 480 ? true : false;
    var photoSize = isMobile ? "mobile" : "desktop";

    properties[photoSize + "_before"] = reinstateChars(properties[photoSize + "_before"]);
    properties[photoSize + "_after"] = reinstateChars(properties[photoSize + "_after"]);

    // Add image srcs

    if (interactiveType != "slider") {

    el.querySelector('#first-photo img').src = properties[photoSize + "_before"];
    el.querySelector('#second-photo img').src = properties[photoSize + "_after"];

    } else {
        el.querySelector('#first-photo img').src = properties[photoSize + "_after"];
        el.querySelector('#second-photo img').src = properties[photoSize + "_before"];
    }

    var slider, start, step, min, max;
    var sliderLabelBefore, sliderLabelAfter;


    switch (interactiveType) {

        case "duo":

            var headingBefore = el.querySelector('#duo-heading-before');
            var headingAfter = el.querySelector('#duo-heading-after');
            headingBefore.innerHTML = decodeURIComponent(properties.label_before);
            headingAfter.innerHTML = decodeURIComponent(properties.label_after);

            if (decodeURIComponent(properties.label_before) == "" && decodeURIComponent(properties.label_after) == "") {
                headingBefore.classList.add("gv-hide");
                headingAfter.classList.add("gv-hide");
            }

            break;


        case "fader":

            slider = el.querySelector('#slider-1');
            start = 0;
            step = 0.05;
            min = 0;
            max = 1;
            sliderLabelBefore = el.querySelector('#slider-before');
            sliderLabelAfter = el.querySelector('#slider-after');

            break;


        case "slider":

            //var headingBefore = el.querySelector('#slider-heading-before');
            //var headingAfter = el.querySelector('#slider-heading-after');
            slider = el.querySelector('#slider-2');
            start = 50;
            step = 0.00000000001;
            min = 0;
            max = 100;
            sliderLabelBefore = el.querySelector('#slider-heading-before');
            sliderLabelAfter = el.querySelector('#slider-heading-after');

            break;

    }


    // Add interactivity if not "Duo"



    if (interactiveType == "fader" || interactiveType == "slider") {

        // var slider = el.querySelector('#slider');
        // var sliderStateBefore = el.querySelector('#slider-before');
        // var sliderStateAfter = el.querySelector('#slider-after');

        // var start = 0;
        // var step = 0.05;

        // if (interactiveType == "slider") {

        //     start = 0.5;
        //     step = 0.00000000001;


        // }


        sliderLabelBefore.innerHTML = decodeURIComponent(properties.label_before);
        sliderLabelAfter.innerHTML = decodeURIComponent(properties.label_after);

        sld = noUiSlider.create(slider, {
            start: [start],
            step: step,
            animate: true,
            animationDuration: 300,
            range: {
                'min': min,
                'max': max
            }
        })

        var secondPhoto = el.querySelector('#second-photo');
        var origin = el.querySelector('.noUi-origin');
        //var origin =el.querySelector('.noUi-origin');
        slider.noUiSlider.on('start', function() {
            secondPhoto.classList.remove("slider-transition");
            secondPhoto.classList.remove("slider-transition-initial");
            origin.classList.remove("origin-smooth");
        });
        slider.noUiSlider.on('end', function(values) {
            secondPhoto.classList.add("slider-transition");
            origin.classList.add("origin-smooth");
            if (interactiveType == "slider") {
                if (values < 5) {
                    slider.noUiSlider.set(0);
                    values=0;
                }

                if (values > 95) {
                    slider.noUiSlider.set(100);
                    values=100;
                }
            }
            // secondPhoto.style.width = values + "%";
            // secondPhoto.offsetHeight;
            // secondPhoto.classList.add("slider-transition");

        });
        slider.noUiSlider.on('update', function(values, handle) {
            if (typeof ga !== 'undefined') {
                fireAnalytics(properties);
            }

            if (interactiveType == "fader") {
                secondPhoto.style.opacity = values;
                sliderLabelAfter.style.opacity = values;
                sliderLabelBefore.style.opacity = 1 - values;
            } else if (interactiveType == "slider") {

                //console.log(origin.style.left);
                //origin =el.querySelector('.noUi-origin');
                secondPhoto.style.width = values + "%";
                //secondPhoto.style.width = origin.style.left;
                updateLabelVisibility(values, sliderLabelBefore, sliderLabelAfter);
            }
        });

        if (interactiveType == "fader") {

            var photoContainer = el.querySelector('.photos-wrapper-container');

            var fadeTimeout;

            photoContainer.addEventListener('click', function() {
                fireAnalytics(properties);


                clearTimeout(fadeTimeout);
                var currentValue = parseFloat(slider.noUiSlider.get());
                var targetValue = currentValue > 0.5 ? 0 : 1;
                var addUp = targetValue > currentValue ? true : false;

                function setSlider() {
                    fadeTimeout = setTimeout(function() {
                        if (addUp) {
                            currentValue += 0.05;
                        } else {
                            currentValue -= 0.05;
                        }

                        slider.noUiSlider.set(currentValue);

                        if (addUp && currentValue < targetValue) {
                            setSlider();
                        } else if (!addUp && currentValue > targetValue) {
                            setSlider();
                        }
                    }, 50)
                }

                setSlider();
            })

        } // end if fader

        if (interactiveType == "slider") {

            var photoContainer = el.querySelector('.photos-wrapper-container');


            photoContainer.addEventListener('click', function(e) {
                fireAnalytics(properties);
                //alert(e.clientX);
                //alert(window.innerWidth);
                //var secondPhoto = el.querySelector('#second-photo');

            //secondPhoto.classList.add("slider-transition");


            })



        } // end if slider

    }


    intervalCheck = setInterval(fetchParentInfo, 300);

    // var base = el.querySelector('.noUi-base');

    // base.addEventListener("mouseup", function() {
    //     el.querySelector('#second-photo').classList.add("slider-transition");
    // });

}

function updateLabelVisibility(v, before, after) {

    if (v < 20) {
        before.style.opacity = 0;

    } else if (v > 80) {

        after.style.opacity = 0;

    } else {
        after.style.opacity = 1;
        before.style.opacity = 1;

    }

}

function fetchParentInfo() {
    iframeMessenger.getPositionInformation(checkIfInView);
}

function checkIfInView(d) {

    //var threshHold =  (d.iframeBottom - d.iframeTop) < currentValue ? true : false;
    var threshold = 300;

    if (d.iframeTop < (d.innerHeight - threshold) && interactiveType == "slider") {
        // document.querySelector('#second-photo').classList.add("slider-transition-initial");
        // document.querySelector('#slider-2').classList.add("fade-in");
        // document.querySelector('#second-photo').classList.remove("gv-hide");
        // var origin = containerEl.querySelector('.noUi-origin');
        // origin.classList.add("origin-smooth");
        // sld.updateOptions({
        //     start: [50]
        // });
        startWidget();
        clearInterval(intervalCheck);
    }

}

function startWidget() {
    if (properties.disable_anim == undefined || properties.disable_anim == "") {
    document.querySelector('#second-photo').classList.add("slider-transition-initial");
    document.querySelector('#slider-2').classList.add("fade-in");
    } else {
     document.querySelector('#slider-2').classList.add("no-fade-in");
    }
    document.querySelector('#second-photo').classList.remove("gv-hide");
    var origin = containerEl.querySelector('.noUi-origin');
    origin.classList.add("origin-smooth");
}

function fireAnalytics(properties) {
    if (properties.analytics_label && firstClick) {
        firstClick = false;
        var msg = properties.analytics_label + "_" + interactiveType;
        ga("send", "event", msg, 'transitioned');
    }
}

function checkAndroidApp(locationObj) {
    //alert(locationObj.protocol);
    //console.log("protocol=" + locationObj.protocol);
    var isAndroidApp = (detect.isAndroid() && (locationObj.protocol === "file://" || locationObj.protocol === "file:")) ? true : false;

    if (isAndroidApp) {
      interactiveType = "duo"; // Force duo mode on Android app to solve swipe problems in iframe
    }

    buildApp( containerEl );

}
