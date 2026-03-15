// ==UserScript==
// @name         VSCO Scraper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scrape data from vsco.org
// @author       You
// @match        https://vsco.co/*
// @grant        GM_download
// ==/UserScript==

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
    console.log(`Found ${elements.length} elements`);
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
    console.log(`Old height ${oldHeight}`);
    while (true) {
        window.scrollBy(0, 5000);
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                // Wait for 300ms
                resolve()
            }, 800);
        })
        let newHeight = document.body.scrollHeight;
        console.log(`New height ${newHeight}`);
        
        if (newHeight === oldHeight) {
            console.log("Reached the end of the page");
            break;
        }
        oldHeight = newHeight;
    }

}

function addDownloadButton() {
    const followButton = document.getElementById('follow-button');
    console.log(followButton);
    
    const toInsert = followButton.parentNode;
    
    const downloadButton = document.createElement('button');
    downloadButton.innerHTML = 'Download';
    downloadButton.className = 'css-a9578v e1lxikmc0';
    downloadButton.addEventListener('click', async () => {
        // // Press the load more button
        clickLoadMore();

        // // // Scroll to the end
        await scrollToEnd();

        // // // Main scraping logic goes here
        download();
    })
    toInsert.insertBefore(downloadButton, followButton);
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

    addDownloadButton();
})();
