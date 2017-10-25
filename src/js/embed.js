import iframeMessenger from 'guardian/iframe-messenger'
//import reqwest from 'reqwest'
import embedHTML from './text/embed.html!text'
import noUiSlider from 'nouislider'

var firstClick = true;

window.init = function init(el, config) {
    iframeMessenger.enableAutoResize();

    el.innerHTML = embedHTML;

    // reqwest({
    //     url: 'http://ip.jsontest.com/',
    //     type: 'json',
    //     crossOrigin: true,
    //     success: (resp) => el.querySelector('.test-msg').innerHTML = `Your IP address is ${resp.ip}`
    // });

	var metadata = document.location.search;

    metadata = "mobile_before=//media.guim.co.uk/8a6284c68dc1bdaaa8d13f930b1d588679091f8d/0_0_4264_4301/496.jpg&desktop_before=//media.guim.co.uk/8a6284c68dc1bdaaa8d13f930b1d588679091f8d/0_0_4264_4301/991.jpg&label_before=Then&amp;mobile_after=//media.guim.co.uk/bf1ab4640975691dc677a79e89fe36757ceb2231/0_0_4264_4301/496.jpg&desktop_after=//media.guim.co.uk/bf1ab4640975691dc677a79e89fe36757ceb2231/0_0_4264_4301/991.jpg&label_after=Now&analytics_label=Berkley%20Square%20-%20Summer%20of%20Love%20Sliders%20-%2050%20years&";
    var properties = {};

    if (metadata) {
        metadata.replace('?', '').split('&').forEach(function(property) {
            properties[property.split('=')[0]] = property.split('=')[1]
        })
    }

    var interactiveType = properties["type"] || "fader";

    // properties.desktop_before = "https://media.guim.co.uk/f55c177459f02193b0d19c083d3a5217a3b42d04/0_0_3702_2708/1000.jpg";
    // properties.desktop_after = "https://media.guim.co.uk/bf1ab4640975691dc677a79e89fe36757ceb2231/0_0_4264_4301/991.jpg";
    // properties.mobile_before = "";
    // properties.mobile_after = "";
    // properties.label_after = "Now";
    // properties.label_before = "Then";


    //el.innerHTML = template;

    var elWidth = el.getBoundingClientRect().width;
    var isMobile = elWidth < 480 ? true : false;
    var photoSize = isMobile ? "mobile" : "desktop";

    el.querySelector('#first-photo img').src = properties[photoSize + "_after"];
    el.querySelector('#second-photo img').src = properties[photoSize + "_before"];

    var slider = el.querySelector('#slider');
    var sliderStateNow = el.querySelector('#slider-now');
    var sliderStateThen = el.querySelector('#slider-then');

    sliderStateNow.innerHTML = decodeURIComponent(properties.label_after);
    sliderStateThen.innerHTML = decodeURIComponent(properties.label_before);

    noUiSlider.create(slider, {
        start: [0],
        step: 0.05,
        animate: true,
        range: {
            'min': 0,
            'max': 1
        }
    })

    var firstPhoto = el.querySelector('#first-photo');
    slider.noUiSlider.on('update', function(values, handle) {
        if (typeof ga !== 'undefined') {
            fireAnalytics(properties);
        }
        firstPhoto.style.opacity = values;
        sliderStateNow.style.opacity = values;
        sliderStateThen.style.opacity = 1 - values;
    });

    var photoContainer = el.querySelector('.fade-container');

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

    

};

function fireAnalytics(properties) {
    if (properties.label && firstClick) {
        firstClick = false;
        ga("send", "event", properties.label, 'transitioned');
    }
}






