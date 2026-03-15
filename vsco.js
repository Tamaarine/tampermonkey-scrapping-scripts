// ==UserScript==
// @name         VSCO Scraper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scrape data from vsco.org
// @author       You
// @match        https://vsco.co/*
// @grant        GM_download
// ==/UserScript==

let stopScrolling = false;

function download() {
    console.log("Listing out all images on the page");
    const images = document.getElementsByClassName('MediaThumbnail');
    for (let index = 0; index < images.length; index++) {
        const image = images[index];
        const imageSource = image.getElementsByTagName('img')[0];
        const splitted = imageSource.getAttribute('srcset').split(',')[0];
        console.log(splitted);
        GM_download(splitted, `image_${index}.jpg`);
    }
}

function clickLoadMore() {
    let elements = document.getElementsByTagName('grain-button');
    for (let i = 0; i < elements.length; i++) {
        try {
            elements[i].shadowRoot.getElementById('loadMore-Button').click();
            console.log("Clicked the expand button");
        } catch (exception) {

        }
    }
}

async function scrollToEnd() {
    // Heustric based approach on scrolling to the end of the page
    let oldHeight = document.body.scrollHeight;
    stopScrolling = false;
    while (true && !stopScrolling) {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                // Wait for 300ms
                resolve()
            }, 800);
        })
        let newHeight = document.body.scrollHeight;

        if (newHeight === oldHeight) {
            console.log("Reached the end of the page");
            break;
        }
        oldHeight = newHeight;
    }

}

function addButtons() {
    const followButton = document.getElementById('follow-button');

    const toInsert = followButton.parentNode;

    // Download Button
    const downloadButton = document.createElement('button');
    downloadButton.innerHTML = 'Download';
    downloadButton.className = 'css-a9578v e1lxikmc0';
    downloadButton.addEventListener('click', async () => {
        // Main scraping logic goes here
        download();
    })
    toInsert.insertBefore(downloadButton, followButton);

    // Scroll button
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = 'Scroll';
    scrollButton.className = 'css-a9578v e1lxikmc0';
    scrollButton.addEventListener('click', async () => {
        clickLoadMore();
        await scrollToEnd();
    })
    toInsert.insertBefore(scrollButton, followButton);

    // Floating stop scrolling button
    const stopScrollButton = document.createElement('button');
    stopScrollButton.innerHTML = 'Stop Scrolling';
    stopScrollButton.className = 'css-a9578v e1lxikmc0';
    stopScrollButton.style.position = 'fixed';
    stopScrollButton.style.bottom = '20px';
    stopScrollButton.style.right = '20px';
    const divContainer = document.createElement('div');
    divContainer.appendChild(stopScrollButton);
    document.body.appendChild(divContainer);
    stopScrollButton.addEventListener('click', async () => {
        console.log("Stop scrolling!");
        stopScrolling = true;
    })

    // Flaoting go up button
    const goUpButton = document.createElement('button');
    goUpButton.innerHTML = 'Go Up';
    goUpButton.className = 'css-a9578v e1lxikmc0';
    goUpButton.style.position = 'fixed';
    goUpButton.style.bottom = '60px';
    goUpButton.style.right = '20px';
    divContainer.appendChild(goUpButton);
    goUpButton.addEventListener('click', async () => {
        console.log("Going up!");
        stopScrolling = true;
        window.scrollTo(0, 0);
    });
}


(async function () {
    'use strict';

    // Wait for the page to load completely
    window.addEventListener('load', function () {
        console.log('VSCO Scraper loaded');
    });

    await new Promise((resolve, _) => {
        setTimeout(() => {
            resolve();
        }, 2000);
    })

    addButtons();
})();
