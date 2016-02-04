import template from './text/main.html!text'
import noUiSlider from './lib/nouislider'
import iframeMessenger from 'guardian/iframe-messenger'

window.init = function init(el, content, context, config, mediator) {
    var metadata = document.location.search;
    var properties = {};

    if(metadata){
        metadata.replace('?','').split('&').forEach(function(property){
            properties[property.split('=')[0]] = property.split('=')[1]
        })
    }

    el.innerHTML = template;

    var elWidth = el.getBoundingClientRect().width;
    var isMobile = elWidth < 480 ? true : false;
    var photoSize = isMobile ? "mobile" : "desktop";
    
    el.querySelector('#first-photo img').src = properties[photoSize + "_after"];
    el.querySelector('#second-photo img').src = properties[photoSize + "_before"];

    var slider = el.querySelector('#slider');
    var sliderStateNow = el.querySelector('#slider-now');
    var sliderStateThen = el.querySelector('#slider-then');

    if(properties.credit){
        el.querySelector('.credit').innerHTML = "<span>" + decodeURIComponent(properties.credit) + "</span";
    }
    

    sliderStateNow.innerHTML = decodeURIComponent(properties.label_after);
    sliderStateThen.innerHTML = decodeURIComponent(properties.label_before);

    noUiSlider.create(slider, {
        start: [0],
        step: 0.05,
        animate:true,
        range: {
            'min': 0,
            'max': 1
        }
    })

    var firstPhoto = el.querySelector('#first-photo');
    slider.noUiSlider.on('update', function( values, handle ) {
        firstPhoto.style.opacity = values;
        sliderStateNow.style.opacity = values;
        sliderStateThen.style.opacity = 1 - values;
    });

    var photoContainer = el.querySelector('.fade-container');

    var fadeTimeout;

    photoContainer.addEventListener('click',function(){
        clearTimeout(fadeTimeout);
        var currentValue = parseFloat(slider.noUiSlider.get());
        var targetValue = currentValue > 0.5 ? 0 : 1;
        var addUp = targetValue > currentValue ? true : false;
        
        function setSlider(){
            fadeTimeout = setTimeout(function(){
                if(addUp){
                    currentValue += 0.05;
                }else{
                    currentValue -= 0.05;
                }

                slider.noUiSlider.set(currentValue);
                
                if(addUp && currentValue < targetValue){
                    setSlider();
                }else if(!addUp && currentValue > targetValue){
                    setSlider();
                }
            },50)
        }

        setSlider();
    })

    iframeMessenger.enableAutoResize();
}