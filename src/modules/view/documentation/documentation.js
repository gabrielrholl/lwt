import { LightningElement } from 'lwc';
//import template from './template.html?raw';

export default class ViewDocumentation extends LightningElement {
    renderedCallback() {
        //console.log(template);
        this.getData();
    }

    async getData() {
        const url = "/docs/example.html";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            let html = await response.text();
            console.log(html);
            let navDiv = this.template.querySelector('[data-id="navDiv"]');
            let contentDiv = this.template.querySelector('[data-id="contentDiv"]');

            // Remove the header content because it includes styles that we don't want
            if(html.includes('<head>')) {
                let substrBefore = html.split('<head>')[0];
                let substrAfter = html.split('<head>')[1];
                substrAfter = substrAfter.split('</head>')[1];
                html = substrBefore + '<head></head>' + substrAfter;
            }

            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(html, 'text/html');
            
            let sidebarChildren = htmlDoc.getElementsByClassName('VPSidebar')[0];
            navDiv.innerHTML = sidebarChildren.innerHTML;


            let contentChildren = htmlDoc.getElementsByClassName('VPDoc')[0].children;
            let children = htmlDoc.getElementsByClassName('Layout')[0].children;
            for(let child of contentChildren) {
                console.log(child.innerHTML);
                contentDiv.innerHTML = child.innerHTML;
                // let contentHtml = child.getElementsByClassName('content')[0]?.innerHTML;
                // console.log(contentHtml);
                // for(let containerChild of containerChildren) {
                //     console.log(containerChild);
                //     let contentHtml = containerChild.getElementsByClassName('content')[0].innerHTML;
                //     console.log(contentHtml);
                // }

            }



            //contentDiv.innerHTML = html;

        } catch (error) {
            console.error(error.message);
        }
    }
}
