const sharp = require('sharp');
sharp('public/assets/album1/image5.jpg')
  .metadata()
  .then(function(metadata) {
    console.log("Image metadata:", metadata);
  })
  .catch(function(err) {
    console.error("Error loading image:", err);
  });
