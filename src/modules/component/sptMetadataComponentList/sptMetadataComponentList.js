import { LightningElement, api } from 'lwc';

export default class SptMetadataComponentList extends LightningElement {
    @api records;

    get recordsByType() {
        if(!this.records) {
            return [];
        }
        let typesToRecords = {};
        for(let record of this.records) {
            if(!typesToRecords.hasOwnProperty(record.type)) {
                typesToRecords[record.type] = [ record ];
            } else {
                typesToRecords[record.type].push(record);
            }
        }
        let typesToRecordsList = [];
        for(let mdType in typesToRecords) {
            typesToRecordsList.push({
                mdType : mdType,
                records : typesToRecords[mdType]
            });
        }
        return typesToRecordsList;
    }

    handleItemDrag(evt){
        const event = new CustomEvent('listitemdrag', {
            detail: evt.detail
        })
        this.dispatchEvent(event);
    }

    handleDragOver(evt){
        evt.preventDefault();
    }

    handleToggleSection(event) {

    }
}