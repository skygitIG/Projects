const track = document.querySelector('.h-track');

if (track) {

  track.classList.add('invisible-scrollbar');
  const trackContainer = track.querySelector('.h-content-container')

  let registeredScroll = false;
  let outerWidth = track.offsetWidth;
  let innerWidth = trackContainer.scrollWidth;

  const updatePct = () => {
    const pct = (track.scrollLeft / (innerWidth - outerWidth)) * 100;

    track.dataset.scrollPercent = pct;
    document.documentElement.style.setProperty('--scroll-pct', `${track.dataset.scrollPercent}%`);
  }
  updatePct();

  window.addEventListener('resize', (e) => {
    outerWidth = track.offsetWidth;
    innerWidth = trackContainer.scrollWidth;
    updatePct();
  });

  track.addEventListener("scroll", (evt) => {
    if (!registeredScroll) {
      track.setAttribute('data-scroll', track.scrollLeft + evt.deltaY + evt.deltaX)
    }
  });

  track.addEventListener("wheel", (evt) => {
    registeredScroll = true;
    evt.preventDefault();
    const tpMultiplier = evt.deltaY % 1 === 0 ? 5 : 1;
    track.setAttribute('data-scroll', track.scrollLeft + (evt.deltaY * tpMultiplier) + (evt.deltaX * tpMultiplier))

  });

  let pos = { top: 0, left: 0, x: 0, y: 0 };

  window.addEventListener('keydown', (e) => {

    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      registeredScroll = true;
      track.setAttribute('data-scroll', track.scrollLeft - 100)
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      registeredScroll = true;
      track.setAttribute('data-scroll', track.scrollLeft + 100)
    }
  })

  const mouseDownHandler = (e) => {
    registeredScroll = true;

    track.style.cursor = 'grabbing';
    track.style.userSelect = 'none';

    pos = {
      left: track.scrollLeft,
      x: e.clientX ?? e.touches?.[0]?.clientX + e.touches?.[0]?.clientY ?? 0,
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);

  };

  const mouseMoveHandler = (e) => {
    registeredScroll = true;

    const cx = e.clientX ?? e.touches?.[0]?.clientX + e.touches?.[0]?.clientY ?? 0
    const dx = cx - pos.x;
    track.setAttribute('data-scroll', pos.left - dx)
  };

  const mouseUpHandler = () => {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);

    track.style.cursor = 'grab';
    track.style.removeProperty('user-select');
  };

  track.addEventListener('mousedown', mouseDownHandler);

  const update = () => {

    if (registeredScroll) {
      const toX = parseFloat(track.getAttribute('data-scroll')) ?? 0;
      const dx = toX - track.scrollLeft;

      if (dx > 1 || dx < -1) {
        track.scrollLeft += dx * .10;
      } else {
        track.scrollLeft = toX;
        registeredScroll = false;
      }
    }
    updatePct();
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);

}

//Color changing sections

const defaults = {
  bgColor: document.documentElement.style.getPropertyValue('--bg-color'),
  textColor: document.documentElement.style.getPropertyValue('--text-color')
}


const bgColorObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.documentElement.style.setProperty('--bg-color', entry.target.dataset.bgColor ?? defaults.bgColor);
      document.documentElement.style.setProperty('--text-color', entry.target.dataset.textColor ?? defaults.textColor);
    }
  });
}, {
  rootMargin: '0px',
  threshold: 0.501
});

document.querySelectorAll('[data-bg-color]').forEach(changer => {
  changer.style.setProperty('background-color', changer.dataset.navColor); //this is just to know which is which
  bgColorObserver.observe(changer);
});
