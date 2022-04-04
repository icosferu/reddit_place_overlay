// ==UserScript==
// @name         r/place overlay template
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  eh
// @author       oralekin, LittleEndu, ekgame, Wieku, DeadRote, violet-ta
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @run-at       document-start
// @grant        none
// ==/UserScript==
if (window.top !== window.self) {

    window.addEventListener('load', async () => {

        console.log('load');

        sources.reverse();

        const root = document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0];

        let canvas, mask, burn, hot_check, visInput;

        const css_size = 2000;
        const size = css_size * 3;

        async function draw () {

            let new_canvas = document.createElement('canvas');
            new_canvas.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;";

            new_canvas.style.width = new_canvas.style.height = css_size + 'px';
            new_canvas.width = new_canvas.height = size;

            let ctx = new_canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;

            ctx.clearRect(0, 0, size, size);

            let images = [];

            for (let src of sources) {
                const image = document.createElement("img");
                image.src = src;

                await image.decode();

                ctx.drawImage(image, 0, 0, size, size);
            }


            if (canvas !== undefined) {
                canvas.remove();
            }
            canvas = new_canvas;

            if (mask !== undefined) {
                mask.remove();
            }

            if (burn !== undefined) {
                burn.remove();
            }


            burn = document.createElement('canvas');
            burn.style = `position: absolute;left: 0;top: 0;image-rendering: pixelated;
                          mix-blend-mode: difference;`;

            burn.style.width = burn.style.height = css_size + 'px';
            burn.width = burn.height = css_size;

            let b_ctx = burn.getContext('2d');
            b_ctx.imageSmoothingEnabled = false;

            b_ctx.drawImage(new_canvas, 0, 0, css_size, css_size);

            root.append(burn);


            mask = document.createElement('canvas');

            mask.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;";

            mask.style.width = mask.style.height = css_size + 'px';
            mask.width = mask.height = css_size;

            let m_ctx = mask.getContext('2d');
            m_ctx.imageSmoothingEnabled = false;

            m_ctx.fillStyle = 'black';
            m_ctx.fillRect(0, 0, size, size);

            m_ctx.globalCompositeOperation = 'destination-out';
            m_ctx.drawImage(burn, 0, 0);

            root.append(mask);

            mask.style.opacity = hot_check.checked ? 1 : visInput.value;


            for (let i = 0; i < css_size; i += 1) {

                ctx.clearRect(0, i * 3, size, 1);
                ctx.clearRect(0, i * 3+2, size, 1);

                ctx.clearRect(i * 3, 0, 1, size);
                ctx.clearRect(i * 3+2, 0, 1, size);
            }

            burn.style.display = hot_check.checked ? 'block' : 'none';
            canvas.style.display = hot_check.checked ? 'none' : 'block';

            root.append(canvas);
            console.log(canvas);
        }

        const camera = document.querySelector("mona-lisa-embed").shadowRoot.querySelector("mona-lisa-camera");

        const waitForPreview = setInterval(() => {
            const preview = camera.querySelector("mona-lisa-pixel-preview");
            if (preview) {
              clearInterval(waitForPreview);
              const style = document.createElement('style')
              style.innerHTML = '.pixel { clip-path: polygon(-20% -20%, -20% 120%, 37% 120%, 37% 37%, 62% 37%, 62% 62%, 37% 62%, 37% 120%, 120% 120%, 120% -20%); }'
              preview.shadowRoot.appendChild(style);
            }
        }, 100);


        function initSlider () {
            let visSlider = document.createElement("div");

            visSlider.style = `
                     position: fixed;
                     right: 80px;
                     display: flex;
                     flex-flow: row nowrap;
                     align-items: center;
                     justify-content: center;
                     height: 40px;
                     top: calc(var(--sait) + 16px);
                     text-shadow: black 1px 0 10px;
                     text-align:center;
                `;

            function from_html (htmlString) {
                var div = document.createElement('div');
                div.innerHTML = htmlString.trim();
                console.log(div);
                return div.firstChild;
            }


            visSlider.append(from_html(`<p style="margin-right: 5px"> Show HOT places </p>`));

            hot_check = from_html(`<input style="margin-right: 15px" type="checkbox">`);
            visSlider.append(hot_check);

            hot_check.addEventListener('input', (e) => {

                burn.style.display = hot_check.checked ? 'block' : 'none';
                canvas.style.display = hot_check.checked ? 'none' : 'block';

                mask.style.opacity = hot_check.checked ? 1 : visInput.value;
            });


            let visText = document.createElement("div");
            visText.innerText = "Highlight zones";
            visText.style['margin-right'] = '5px';
            visSlider.appendChild(visText);

            visInput = document.createElement("input");
            visInput.setAttribute("type","range");
            visInput.setAttribute("min","0");
            visInput.setAttribute("max","1");
            visInput.setAttribute("step","0.01");
            visInput.value = 0.3;

            visSlider.appendChild(visInput);

            visInput.addEventListener("input", function(evt) {

                mask.style.opacity = hot_check.checked ? 1 : visInput.value;
            });

            return visSlider;
        }

        let slider = initSlider();

        let interval = setInterval(() => {

            let topControls = document.querySelector("mona-lisa-embed").shadowRoot.querySelector(".layout .top-controls");
            if (topControls) {

                clearInterval(interval);
                topControls.after(slider);
            }
        }, 1000);

        draw();
        //setInterval(draw, 180 * 1000);

    }, false);

    const sources = [
        "https://raw.githubusercontent.com/sssata/canada_place_template/main/template.png", //canada flag
        //"https://cdn.discordapp.com/attachments/960267990551625789/960533181210169374/Beznazwyoverlay.png",   //center alliance
        //"https://raw.githubusercontent.com/BSBMteam/r-place-GreatWave/main/dotted-place-template-GreatWave-StarWars-GME-OSU-and-More.png",  // the great wave

                    ];
}
