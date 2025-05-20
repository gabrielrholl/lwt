import { LightningElement } from 'lwc';

export default class SptMetadataComponentProject extends LightningElement {

    projects = [
        'Sales',
        'Service',
        'Trade',
        'Dealer'
    ];

    handleDragOver(event) {
        event.preventDefault();
    }

    handleDrop(event) {
        this.dispatchEvent(new CustomEvent('itemdrop', {
            detail: event.target.dataset.id
        }));
    }
}