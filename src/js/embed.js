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

    metadata = "mobile_before=//media.guim.co.uk/8a6284c68dc1bdaaa8d13f930b1d588679091f8d/0_0_4264_4301/496.jpg&desktop_before=//media.guim.co.uk/8a6284c68dc1bdaaa8d13f930b1d588679091f8d/0_0_4264_4301/991.jpg&label_before=Then&amp;mobile_after=//media.guim.co.uk/bf1ab4640975691dc677a79e89fe36757ceb2231/0_0_4264_4301/496.jpg&mobile_after=//media.guim.co.uk/bf1ab4640975691dc677a79e89fe36757ceb2231/0_0_4264_4301/991.jpg&desktop_after=//media.guim.co.uk/bf1ab4640975691dc677a79e89fe36757ceb2231/0_0_4264_4301/991.jpg&desktop_after=//media.guim.co.uk/bf1ab4640975691dc677a79e89fe36757ceb2231/0_0_4264_4301/991.jpg&label_after=Now&analytics_label=Berkley%20Square%20-%20Summer%20of%20Love%20Sliders%20-%2050%20years&";
    var properties = {};

    if (metadata) {
        metadata.replace('?', '').split('&').forEach(function(property) {
            properties[property.split('=')[0]] = property.split('=')[1]
        })
    }

    var interactiveType = properties["type"] || "fader";


    //interactiveType = "duo";
    interactiveType = "slider";
    //interactiveType = "fader";


    el.querySelector('#interactive-now-and-then-container').classList.add(interactiveType);

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

    el.querySelector('#first-photo img').src = properties[photoSize + "_before"];
    el.querySelector('#second-photo img').src = properties[photoSize + "_after"];

    if (interactiveType == "duo") {
        var headingBefore = el.querySelector('#heading-before');
        var headingAfter = el.querySelector('#heading-after');

        headingBefore.innerHTML = decodeURIComponent(properties.label_before);
        headingAfter.innerHTML = decodeURIComponent(properties.label_after);
    }

    else if (interactiveType == "fader" || interactiveType == "slider") {

    var slider = el.querySelector('#slider');
    var sliderStateBefore = el.querySelector('#slider-before');
    var sliderStateAfter = el.querySelector('#slider-after');

    var start = 0;
    var step = 0.05;

    if (interactiveType == "slider") {

        start = 0.5;
        step = 0.00000000001;


    }
    

    sliderStateBefore.innerHTML = decodeURIComponent(properties.label_before);
    sliderStateAfter.innerHTML = decodeURIComponent(properties.label_after);

    noUiSlider.create(slider, {
        start: [start],
        step: step,
        animate: true,
        range: {
            'min': 0,
            'max': 100
        }
    })

    var secondPhoto = el.querySelector('#second-photo');
    //var origin =el.querySelector('.noUi-origin');
    slider.noUiSlider.on('start', function(){
    secondPhoto.classList.remove("slider-transition");
    });
     slider.noUiSlider.on('end', function(){
    secondPhoto.classList.add("slider-transition");
    });
    slider.noUiSlider.on('update', function(values, handle) {
        if (typeof ga !== 'undefined') {
            fireAnalytics(properties);
        }

        if (interactiveType == "fader") {
        secondPhoto.style.opacity = values;
        sliderStateAfter.style.opacity = values / 100;
        sliderStateBefore.style.opacity = 1 - (values / 100);
        } else if (interactiveType == "slider") {

            //console.log(origin.style.left);
            //origin =el.querySelector('.noUi-origin');
        secondPhoto.style.width = values + "%";
        //secondPhoto.style.width = origin.style.left;
        }
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

} // end if fader

    

};

function fireAnalytics(properties) {
    if (properties.label && firstClick) {
        firstClick = false;
        ga("send", "event", properties.label, 'transitioned');
    }
}






