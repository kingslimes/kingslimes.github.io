!function( global ) {
"use strict";
document.head.innerHTML += `<link rel="preconnect" href="https://kingslimes.github.io">
  <link rel="preload" href="https://kingslimes.github.io/fontawesome/css/pro.min.css" as="style">
  <link rel="stylesheet" href="https://kingslimes.github.io/fontawesome/css/pro.min.css" crossorigin="anonymous" media="all">`;
function createNode( self ) {
  var container, id, video, seek, trigger, icons, curMin, curSec, showTime, isCurMin, isCurSec, screen, timeOut, start, loading, inter, full, vol
  var isTime = true, isControls = true, isTouch = "ontouchstart" in document.documentElement, isFullscreen = false
  id = Math.floor( Math.random() * 999999 - 1 )
  function get( child ) {
    return document["querySelector"](`.iplayer_${id} ${child}`);
  }
  function handler( elm, evt, fn ) {
    const io = evt.split(" ");
    for (var i=0; i<io.length; i++) {
      elm.addEventListener(io[i], function(e) {
        !fn(e)
      })
    }
    return elm
  }
  function updateProgress( arg ) {
    arg.style.backgroundImage = `linear-gradient(to right, white ${arg.value}%, rgba(200,200,200,.3) ${arg.value}%`
  }
  function toggleFullscreen( elem, option, target ) {
    if (!document.fullscreenElement && !document.mozFullScreenElement &&
    !document.webkitFullscreenElement && !document.msFullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen(option);
        window.screen&&window.screen.orientation.lock("landscape");
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen(option);
        window.screen&&window.screen.orientation.lock("landscape");
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen(option);
        window.screen&&window.screen.orientation.lock("landscape");
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(option);
        window.screen&&window.screen.orientation.lock("landscape");
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }
  function openControls() {
    isControls = true
    clearTimeout(timeOut)
    container.classList.remove("hide")
    setInterval(function(){
      if ( video.paused ) {
        clearTimeout(timeOut)
        return false
      }
    }, 400)
    timeOut = setTimeout(function() {
      container.classList.add("hide")
      isControls = false
    }, 3000)
  }
  function destroy() {
    start.parentElement.innerHTML = "video.error(404)";
    loading.remove();
    screen.remove()
  }
  self.oncontextmenu = function(e) {
    e.preventDefault()
  }
  self.playsinline = true
  self.removeAttribute("id")
  self.setAttribute("class", "iplayer_video")
  self.setAttribute("data-player", "iplayer")
  container = document.createElement("div");
  container.className = `iplayer iplayer_container iplayer_${id} hide`
  self.insertAdjacentHTML("beforebegin", container.outerHTML)
  container = document.getElementsByClassName(`iplayer_${id}`)[0];
  container.appendChild( self )
  container.innerHTML += `<div class="iplayer_screen"><div class="iplayer_controls"><button class="iplayer_btn iplayer_trigger"><i class="fa-solid fa-play"></i></button><div class="iplayer_progress"><div class="iplayer_buffer"></div><input class="iplayer_seek" type="range" min="0" max="100" value="0" step="0.1"></div><div class="iplayer_times">00:00</div><button class="iplayer_btn iplayer_fullscreen"><i class="fa-solid fa-expand-wide"></i></button></div></div><svg class="iplayer_loading" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin:auto;background:0 0;display:block;shape-rendering:auto" width="5rem" height="5rem" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" r="32" stroke-width="8" stroke="#ffffff" stroke-dasharray="50.26548245743669 50.26548245743669" fill="none" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform></circle></svg><div class="iplayer_start"><i class="fa-solid fa-play"></i></div><div class="iplayer_menu"><div class="iplayer_sound"><span>sound</span><div class="iplayer_row"><i class="fa-solid fa-volume"></i><input class="iplayer_volume" type="range" min="0" max="1" value="1" step="0.1"></div></div><div class="iplayer_speed"><span>speed</span><div class="iplayer_row"><div class="iplayer_box" data-box="1.5">1.5x</div><div class="iplayer_box" data-box="1.25">1.25x</div><div class="iplayer_box" data-box="1">Normal</div><div class="iplayer_box" data-box="0.75">0.75x</div><div class="iplayer_box" data-box="0.5">0.5x</div></div></div></div>`
  icons = {
    play: '<i class="fa-solid fa-play"></i>',
    pause: '<i class="fa-solid fa-pause"></i>',
    expand: '<i class="fa-solid fa-expand-wide"></i>',
    compress: '<i class="fa-solid fa-compress-wide"></i>',
    muted: '<i class="fa-solid fa-volume-slash"></i>',
    unmute: '<i class="fa-solid fa-volume"></i>'
  }
  screen = get(".iplayer_screen");
  video = get(".iplayer_video");
  seek = get(".iplayer_seek");
  trigger = get(".iplayer_trigger");
  showTime = get(".iplayer_times");
  start = get(".iplayer_start i");
  loading = get(".iplayer_loading");
  full = get(".iplayer_fullscreen");
  vol = get(".iplayer_volume");
  handler(video, "ended", function(e) {
    openControls()
  })
  document.querySelectorAll(`.iplayer_${id} .iplayer_box`).forEach(box=>{
    handler(box, "click", function(e) {
      openControls()
      video.playbackRate = e.target.dataset.box
    })
  })
  handler(container, "dblclick", function(e) {
    toggleFullscreen(container, { navigationUI: "hide" }, full)
  })
  handler(video, "loadeddata", function(e) {
    vol.value = video.volume
    video.muted = false
  })
  handler(vol, "input", function(e) {
    openControls()
    video.volume = vol.value
  })
  handler(document, "fullscreenchange", function(e) {
    if (document.fullscreenElement) {
      full.innerHTML = icons.compress
    } else {
      full.innerHTML = icons.expand
    }
  })
  handler(full, "click", function(e) {
    toggleFullscreen(container, { navigationUI: "hide" }, full)
  })
  handler(video, "canplaythrough waiting playing pause", function(e) {
    e.type=="waiting" ? (loading.style.display="block") : (loading.style.display="none")
  })
  handler(start, "click", function(e) {
    e.target.parentElement.remove()
    openControls()
    video.play()
  })
  handler(video, "progress", function(e) {
    if ( video.buffered.length>0 ) {
      get(".iplayer_buffer").style.width = Math.round( video.buffered.end( video.buffered.length - 1 ) * (100/video.duration) )+"%";
    }
  })
  if ( isTouch ) {
    handler(screen, "touchend", function(e) {
      openControls()
    })
  } else {
    handler(screen, "mouseover mousemove", function(e) {
      e.type=="mouseover"&&container.classList.add("hide")
      e.type=="mousemove"&&openControls()
    })
  }
  handler(video, "timeupdate", function(e) {
    seek.value = video.currentTime * (100/video.duration) 
    updateProgress(seek)
    curMin = Math.floor( video.currentTime / 60)
    curSec = Math.floor( video.currentTime - curMin * 60).toString().padStart(2, 0)
    isCurMin = Math.floor( (video.duration - video.currentTime) / 60)
    isCurSec = Math.floor( ( video.duration - video.currentTime ) - isCurMin * 60).toString().padStart(2, 0)
    showTime.innerHTML = isTime ? `${curMin}:${curSec}` : `-${isCurMin}:${isCurSec}`
  })
  handler(seek, "input", function(e) {
    updateProgress(seek)
    openControls()
    video.currentTime = video.duration * (seek.value / 100)
  })
  handler(showTime, "click", function(e) {
    isTime ? (isTime = false) : (isTime = true)
    showTime.innerHTML = isTime ? `${curMin}:${curSec}` : `-${isCurMin}:${isCurSec}`
  })
  handler(video, "play pause", function(e) {
    video.paused ? (trigger.innerHTML=icons.play) : (trigger.innerHTML=icons.pause)
  })
  handler(trigger, "click", function(e) {
    video.paused ? video.play() : video.pause()
  })
  video.onerror = destroy
  document.querySelectorAll(`.iplayer_${id} video source`).forEach(source => {
    source.onerror = destroy
  })
  return video
}
function init( selector ) {
  if ( typeof selector == "boolean" ) throw new Error("system.error(type)");
  const self = typeof selector=="string"&&(document.querySelector(selector)!==null)&&document.querySelector(selector) || typeof selector=="object"&&(selector instanceof HTMLElement)&&selector;
  if ( !self instanceof HTMLElement || self.constructor.name !== "HTMLVideoElement" ) throw new Error("system.error(element)");
  self.getAttribute("data-player")!=="iplayer"&&createNode( self );
  return { constructor:iplayer }
}
global['iplayer'] = function iplayer( selector ) {
  return new init( selector );
}
}( this )
