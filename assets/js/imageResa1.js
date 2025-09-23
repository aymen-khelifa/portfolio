// Fonction générique pour créer un carousel
function initCarousel(modalId, carouselClass, imagesArray) {
  let xPos = 0;

  gsap.timeline()
    .set(`#${modalId} .ring`, { rotationY: 180, cursor: 'grab' })
    .set(`#${modalId} .img`, {
      rotateY: (i) => i * -360 / imagesArray.length,
      transformOrigin: '50% 50% 2000px',
      z: -2000,
      backgroundImage: (i) => `url(${imagesArray[i]})`,
      backfaceVisibility: 'hidden'
    })
    .from(`#${modalId} .img`, {
      duration: 1.5,
      y: 100,
      opacity: 0,
      stagger: 0.1,
      ease: 'expo'
    })
    .add(() => {
      $(`#${modalId} .img`).on('mouseenter', (e) => {
        let current = e.currentTarget;
        gsap.to(`#${modalId} .img`, { opacity: (i, t) => (t == current ? 1 : 0.5), ease: 'power3' });
      });
      $(`#${modalId} .img`).on('mouseleave', () => {
        gsap.to(`#${modalId} .img`, { opacity: 1, ease: 'power2.inOut' });
      });
    }, '-=0.5');

  // Drag rotation
  function dragStart(e) {
    if (e.touches) e.clientX = e.touches[0].clientX;
    xPos = Math.round(e.clientX);
    gsap.set(`#${modalId} .ring`, { cursor: 'grabbing' });
    $(window).on('mousemove touchmove', drag);
  }

  function drag(e) {
    if (e.touches) e.clientX = e.touches[0].clientX;

    gsap.to(`#${modalId} .ring`, {
      rotationY: '-=' + ((Math.round(e.clientX) - xPos) % 360),
      onUpdate: () => {
        gsap.set(`#${modalId} .img`, {
          backgroundPosition: (i) => getBgPos(i)
        });
      }
    });

    xPos = Math.round(e.clientX);
  }

  function dragEnd() {
    $(window).off('mousemove touchmove', drag);
    gsap.set(`#${modalId} .ring`, { cursor: 'grab' });
  }

  function getBgPos(i) {
    return (
      100 -
      gsap.utils.wrap(
        0,
        360,
        gsap.getProperty(`#${modalId} .ring`, 'rotationY') -
          180 -
          (i * 360) / imagesArray.length
      ) /
        360 *
        300
    ) + 'px 0px';
  }

  // Events
  $(window).on('mousedown touchstart', dragStart);
  $(window).on('mouseup touchend', dragEnd);

  // Modal open/close
  const modal = document.getElementById(modalId);
  const eyeBtn = document.querySelector(`[data-modal="${modalId}"]`);
  const closeBtn = modal.querySelector(".close-btn");

  eyeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}


// Images Resa
const myImagesResa = [];
for (let i = 1; i <= 12; i++) {
  myImagesResa.push(`./assets/images/a${i}.png`);
}
initCarousel("carouselModalResa1", "resa-carousel1", myImagesResa);
