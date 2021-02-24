(() => {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.command == "start") {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            let onThumbnail = false;

            document.addEventListener("mousemove", (e) => {
                let thumbnail = getThumbnailElement(e.target);
                if (thumbnail == null) {
                    onThumbnail = false;
                } else {
                    if (onThumbnail != true) {
                        let a = thumbnail.querySelector("a#thumbnail");
                        let iframe = thumbnail.querySelector("iframe");
                        if (iframe == null) {
                            let vidid = a.href.split("?v=")[1];
                            iframe = document.createElement("iframe");
                            iframe.setAttribute("src", "https://www.YouTube.com/embed/" + vidid + "?enablejsapi=1&autoplay=0&showinfo=0&controls=0&loop=1&rel=0&playlist=" + vidid);
                            iframe.setAttribute("allow", "autoplay")
                            iframe.setAttribute("frameborder", 0);
                            iframe.addEventListener("load", () => {
                                iframe.contentDocument.querySelector(".ytp-show-cards-title").remove();
                                iframe.contentDocument.querySelector(".ytp-watermark").remove();
                                iframe.style.pointerEvents = "none";

                                thumbnail.addEventListener("mouseover", () => {
                                    iframe.setAttribute("width", a.clientWidth);
                                    iframe.setAttribute("height", a.clientHeight);
                                    a.querySelector("yt-img-shadow").style.display = "none";
                                    a.querySelector("#overlays").style.display = "none";
                                    a.querySelector("#mouseover-overlay").style.display = "none";
                                    a.querySelector("#hover-overlays").style.display = "none";
                                    iframe.style.display = "block";
                                    iframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
                                    iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                                });
                                thumbnail.addEventListener("mouseout", () => {
                                    iframe.setAttribute("width", a.clientWidth);
                                    iframe.setAttribute("height", a.clientHeight);
                                    a.querySelector("yt-img-shadow").style.display = "block";
                                    a.querySelector("#overlays").style.display = "block";
                                    a.querySelector("#mouseover-overlay").style.display = "block";
                                    a.querySelector("#hover-overlays").style.display = "block";
                                    iframe.style.display = "none";
                                    iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
                                });
                                if (onThumbnail) {
                                    var evt = document.createEvent("HTMLEvents");
                                    evt.initEvent("mouseover", true, true);
                                    thumbnail.dispatchEvent(evt);
                                }
                            });
                            a.appendChild(iframe);
                        }
                        onThumbnail = true;
                    }
                }
            });
        }
    });

    function getThumbnailElement(element) {
        while (element) {
            if (element.tagName.toLowerCase() == "ytd-thumbnail") {
                return element;
            }
            element = element.parentElement;
        }
        return null;
    }
})();