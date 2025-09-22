document.querySelector('.sura-container').addEventListener('click', function(event) {
  if (event.target.tagName === 'LI') {
    const suraNumber = event.target.getAttribute('data-sura-number');
    window.location.href = `/sura/${suraNumber}`;
  }
});