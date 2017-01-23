var btn = document.querySelector('#create');
var gridBtns = document.querySelectorAll('.insert-grid');
var errorContainer = document.querySelector('#error-container');
var dropzones = document.querySelectorAll('.dropzone');
var translationTable = {
	"mobile_before" : "Before image - small",
	"desktop_before": "Before image - big",
	"mobile_after" : "After image - small",
	"desktop_after": "After image - big",
	"credit": "Photo credit",
	"label_before": "Before label",
	"label_after": "After label"
}
var hasDragged = false;

document.addEventListener("dragover", function(e) {
    e.preventDefault();
 }, false);

document.addEventListener("dragenter", function(e) {
	if(!hasDragged){
		dropzones[0].classList.add("dragging");
		dropzones[1].classList.add("dragging");

		hasDragged = true;
	}

	if(e.target.className.indexOf('dragcapture') > -1){
		e.target.parentElement.classList.add('active');
	}
}, false);

document.addEventListener("dragleave", function(e) {
	if(e.target.className.indexOf('dragcapture') > -1){
		e.target.parentElement.classList.remove('active');
	}
}, false);

document.addEventListener("drop", function(e) {
    e.preventDefault();

    dropzones[0].classList.remove("dragging","active");
	dropzones[1].classList.remove("dragging","active");
	hasDragged = false;

	var dt = e.dataTransfer;
	var dataText = dt.getData("application/vnd.mediaservice.crops+json");
	var dataObject = JSON.parse(dataText);
	var assets = dataObject.assets;

	var bigDimension = null;
	var bigImage;

	var smallDimension = null;
	var smallImage;

	assets.forEach(function(e){
		if(e.dimensions.width > 480){
			if(smallDimension === null || e.dimensions.width - 480 < smallDimension){
				smallDimension = e.dimensions.width - 480;
				smallImage = e;
			}
		}


		if(e.dimensions.width > 780){
			if(bigDimension === null || e.dimensions.width - 780 < bigDimension){
				bigDimension = e.dimensions.width - 780;
				bigImage = e;
			}
		}

	})

	fillInputFields(smallImage,bigImage, e.target.parentElement.parentElement,assets);
  }, false);

function fillInputFields(smallImage,bigImage,target,assets){
	target.querySelector('.mobile_input').value = smallImage.secureUrl;
	target.querySelector('.desktop_input').value = bigImage.secureUrl;

	var img = document.createElement('img');
	img.src = smallImage.file;

	target.querySelector('.dropzone').innerHTML = img.outerHTML;

	var otherSizes = target.querySelectorAll('.alternativeSizes');

	for(i=0; i<2; i++){
		otherSizes[i].innerHTML = "";
		assets.forEach(function(asset){
			var sizeButton = document.createElement('span');
			sizeButton.innerHTML = asset.dimensions.width + 'px';
			sizeButton.addEventListener('click',function(e){
				e.target.parentElement.parentElement.parentElement.querySelector('input').value = asset.secureUrl;
				e.target.parentElement.querySelector('.selectedSize').classList.remove('selectedSize');
				e.target.classList.add('selectedSize');
			})

			if(asset.dimensions.width === smallImage.dimensions.width && i === 0){
				sizeButton.classList.add('selectedSize');
			}else if(asset.dimensions.width === bigImage.dimensions.width && i===1){
				sizeButton.classList.add('selectedSize');
			}
			otherSizes[i].appendChild(sizeButton)
		})
	}
}

var editBtn = document.querySelector('#edit-old-link');
editBtn.addEventListener('click',function(e){
	var oldLink = prompt('What\'s the link to the slider?')
	var a = document.createElement('a');
	a.href = oldLink;
	var data = a.search;

	if(!data){
		return false
	}

	var dataValues = data.split('&');
	dataValues.forEach(function(d,i){
		if(i===0){
			d = d.replace('?','')
		}

		var dSplit = d.split('=');
		if(dSplit[0]){
			var el = document.querySelector('input[name=' + dSplit[0] + ']')
			if(el){
				el.value = dSplit[1];
			}
		}
	})
})

btn.addEventListener('click',function(e){
	var formData = $('form').serializeArray();
	var values = {};
	var base = window.location.hostname.indexOf("localhost") > -1 ? "http://localhost:8000/embed.html?" : "https://interactive.guim.co.uk/2016/01/now-and-then-embed/embed/embed.html?";
	var base = "https://interactive.guim.co.uk/2016/01/now-and-then-embed/embed/embed.html?";
	var url = base;
	errors = [];

	console.log(formData);

	formData.forEach(function(p,i){
		if(p.value == ""){
			if(p.name !== "label_after" && p.name !== "label_before"){
				errors.push(p.name);
			}
		}
		if(p.name=== "mobile_before" || p.name=== "desktop_before" || p.name=== "mobile_after" || p.name=== "desktop_after"){
			p.value = p.value.replace("http://","//");
			p.value = p.value.replace("https://","//");
		}

		document.querySelector('input[name="' + p.name + '"]').className -= " is-error";

		values[p.name] = p.value;
		url += p.name + "=" + p.value + "&";
	})

	if(errors.length > 0){
		errorContainer.innerHTML = "You haven't filled in all the fields yet";
		errorContainer.style.display = "block";

		errors.forEach(function(i,j){
			console.log(i)
			document.querySelector('input[name="' + i + '"]').className += " is-error";
		})

		return;
	}else{
		errorContainer.innerHTML = "";
		errorContainer.style.display = "none";
	}


	// RESULTS
	var resultContainer = document.querySelector('#result-container');
	resultContainer.className = "active";

	var input = resultContainer.querySelector('input');
	input.value = url;

	iframe = document.querySelector('iframe');
	iframe.style.width = '100%';
	iframe.style.border = 'none';
	iframe.style.overflow = 'hidden';
	iframe.height = '150'; // default height so that no-script iframes aren't super high
	iframe.src = url;
	iframe.seamless = 'seamless';
	iframe.scrolling = 'no';

	// Listen for requests from the window
	window.addEventListener('message', function(event) {
	    // IE 8 + 9 only support strings
	    var message = JSON.parse(event.data);

	    // Actions
	    switch (message.type) {
	        case 'set-height':
	            iframe.height = message.value;
	            break;
	        case 'navigate':
	            document.location.href = message.value;
	            break;
	        case 'scroll-to':
	            window.scrollBy(message.x, message.y);
	            break;
	        case 'get-position':
	            _postMessage({
	                'iframeTop':    iframe.getBoundingClientRect().top,
	                'innerHeight':  window.innerHeight,
	                'pageYOffset':  window.pageYOffset
	            });
	            break;
	        default:
	           console && console.error && console.error('Received unknown action from iframe: ', message);
	    }
	}, false);


	document.querySelector('#result-title').addEventListener('click',function(e){
		var iframeContainer = document.querySelector('#image-result');

		console.log(e.target.className.indexOf('active'))
		if(e.target.className.indexOf('active') < 0){
			if(e.target.innerHTML === "Desktop preview"){
				iframeContainer.style.width = "620px";
				e.target.classList.add('active');
				document.querySelector('.to-mobile').classList.remove('active');
			}else if(e.target.innerHTML === "Mobile preview"){
				iframeContainer.style.width = "320px";
				e.target.classList.add('active');
				document.querySelector('.to-desktop').classList.remove('active');
			}

			setTimeout(function(){
				document.querySelector('iframe').src = document.querySelector('iframe').src
			},500)
		}




	})

	window.scrollTo(0,500);
})
