const loadingEl = document.querySelector('#loading');  

function loadImage(url) {
	// wrap image loading in a promise
	return new Promise((resolve, reject) => {
		 // A new promise is "pending"
		 const image = new Image();
		 image.src = url;
		 image.addEventListener('load', (evt) => {
		   // Resolving a promise changes its state to "fulfilled"
		   // unless you resolve it with a rejected promise
		   resolve(image);
		 });
		 image.addEventListener('error', (evt) => {
		   // Rejecting a promise changes its state to "rejected"
		   reject(new Error('Could not load image at ' + url));
		 });
	});
}

function displayImages(images) {
	images.forEach((image) => {
 		document.body.appendChild(image);
	});
}

/******************************************************************************/

const urls = [
	`https://lorempixel.com/200/200/food/${Math.ceil(Math.random() * 10)}`,
	`https://lorempixel.com/400/400/nature/${Math.ceil(Math.random() * 8)}`, 
	`https://lorempixel.com/600/600/transport/${Math.ceil(Math.random() * 10)}`,	
];

const promises = [];

urls.forEach((url) => {
	promises.push(loadImage(url));
});

Promise.all(promises) // Array of promises to complete
	.then((results) => {
	 console.log('All data has loaded', results);
		 loadingEl.setAttribute('style', 'display:none');
		 displayImages(results);
	})
	.catch((error) => {
		console.log(`One or more requests have failed: ${error}`);
	}
);
