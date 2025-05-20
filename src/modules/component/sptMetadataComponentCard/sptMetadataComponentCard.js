import { LightningElement, api } from 'lwc';
export default class SptMetadataComponentCard extends LightningElement {
    @api record;

    itemDragStart(){
        this.dispatchEvent(new CustomEvent('itemdrag', {
            detail: {
                id : this.record.id
            }
        }));
    }
}