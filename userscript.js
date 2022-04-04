// ==UserScript==
// @name         r/place overlay template
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  eh
// @author       violet-ta
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @run-at       document-end
// @grant        none
// ==/UserScript==
if (window.top !== window.self) {
    console.log('script');

    window.addEventListener('load', async () => {

        console.log('load');

        const root = document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0];
        let canvas = document.createElement('canvas');

        const css_size = 2000;
        const size = css_size * 3;

        canvas.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;";

        canvas.style.width = canvas.style.height = css_size + 'px';
        canvas.width = canvas.height = size;

        let ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;


        async function draw () {

            ctx.clearRect(0, 0, size, size);

            for (let src of sources.reverse()) {
                const image = document.createElement("img");
                image.src = src;

                await image.decode();

                if (image.naturalWidth === 2000 && image.naturalHeight === 2000) {

                    ctx.drawImage(image, 0, 0, size, size);
                } else {

                    ctx.drawImage(image, 0, 0);
                }
            }

            for (let i = 0; i < css_size; i += 1) {

                ctx.clearRect(0, i * 3, size, 1);
                ctx.clearRect(0, i * 3+2, size, 1);

                ctx.clearRect(i * 3, 0, 1, size);
                ctx.clearRect(i * 3+2, 0, 1, size);
            }

            console.log('draw');
        }

        draw();

        setInterval(() => {

            if (false) {
                draw();
            }
        }, 5 * 1000);


        root.append(canvas);
        console.log(canvas);

    }, false);

    const sources = ["https://raw.githubusercontent.com/sssata/canada_place_template/main/template.png"];

}
