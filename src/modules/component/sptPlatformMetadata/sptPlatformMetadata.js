import { LightningElement } from 'lwc';

// import 'regenerator-runtime/runtime';
// import axios from 'axios';

//import { updateRecord } from 'lightning/uiRecordApi';
//import { refreshApex } from '@salesforce/apex';
// import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName'
// import ID_FIELD from '@salesforce/schema/Opportunity.Id'
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// import getFlowMetadata from '@salesforce/apex/SPT_PlatformMetadataController.getFlowMetadata';
// import describeMetadata from '@salesforce/apex/SPT_PlatformMetadataController.describeMetadata';
// import listMetadata from '@salesforce/apex/SPT_PlatformMetadataController.listMetadata';
// import getDependencies from '@salesforce/apex/SPT_PlatformMetadataController.getDependencies';
// import queryMetadataComponentsByType from '@salesforce/apex/SPT_PlatformMetadataController.queryMetadataComponentsByType';
// import queryMetadataComponentsByIds from '@salesforce/apex/SPT_PlatformMetadataController.queryMetadataComponentsByIds';
// import queryRecentMetadata from '@salesforce/apex/SPT_PlatformMetadataController.queryRecentMetadata';
// import saveMetadataComponents from '@salesforce/apex/SPT_PlatformMetadataController.saveMetadataComponents';

export default class SptPlatformMetadata extends LightningElement {
    mdTypes;
    lookupMdTypes = [];
    selectedMdType;

    fullListingMdTypes = new Set();
    mdTypesToCmps = {};
    lookupMdCmps = [];
    selectedMdCmp;

    dependencies = [];
    relDependencies = [];

    pickVals = [
        'Sales',
        'Service',
        'Trade',
        'Dealer'
    ];
    recordId

    recentCmps = [];

    get isCmpSelected() {
        return !!(this.selectedMdType) && !!(this.selectedMdCmp);
    }

    get activeMdCmp() {
        if(!this.selectedMdType || !this.mdTypesToCmps.hasOwnProperty(this.selectedMdType)) {
            return null;
        }
        return this.mdTypesToCmps[this.selectedMdType].find((mdCmp) => {
            return mdCmp.fullName === this.selectedMdCmp;
        });
    }

    get selectedMdTypeObj() {
        return this.selectedMdType ? this.mapMetadataTypeToLookupMDType({xmlName : this.selectedMdType}) : null;
    }

    get selectedMdCmpObj() {
        return this.selectedMdCmp ? this.mapMetadataCmpToLookupMDCmp({fullName : this.selectedMdCmp }) : null;
    }
    
    connectedCallback() {
        //this.queryFlowMetadata('Account_After_Save');
        this.getMetadataTypes();
        this.getRecentComponents();
    }

    describeMetadata() {
        return Promise.resolve();
    }

    getMetadataTypes() {
        // this.describeMetadata()
        // .then(results => {
        //     let tmpMdTypes = JSON.parse(JSON.stringify(results));
        //     this.alphabeticSortByProp(tmpMdTypes, 'xmlName');
        //     this.mdTypes = tmpMdTypes;
        // })
        // .catch(error => {
        //     console.log(error);
        // }); 
    }

    queryRecentMetadata() {
        // return axios.get('/user', {
        //     params: {
        //         ID: 12345
        //     }
        // })
        // .then(function (response) {
        //     console.log(response);
        // })
        // .catch(function (error) {
        //     console.log(error);
        // })
        // .finally(function () {
        //     // always executed
        // });  

    }

    getRecentComponents() {
        // this.queryRecentMetadata()
        // .then(results => {
        //     console.log(JSON.stringify(results, null, 2));
        //     this.buildRecentComponents(results);
        // })
        // .catch(error => {
        //     console.log(error);
        // }); 
    }

    buildRecentComponents(mdCmps, newCmp) {
        if(newCmp) {
            let newCmpIndex = mdCmps.findIndex((mdCmp) => {
                return mdCmp.id === newCmp.id && mdCmp.orgId === newCmp.orgId;
            });
            if(newCmpIndex >= 0) {
                mdCmps.splice(newCmpIndex, 1);
            }
            mdCmps.unshift(newCmp);
        }
        let tmpRecentCmps = [];
        for(let mdCmp of mdCmps) {
            let tmpRecentCmp = JSON.parse(JSON.stringify(mdCmp));
            tmpRecentCmp.formattedName = tmpRecentCmp.type + '.' + tmpRecentCmp.fullName;
            tmpRecentCmps.push(tmpRecentCmp);
        }
        this.recentCmps = tmpRecentCmps.slice(0, 5);
    }

    handleRecentCmpClick(event) {
        let clickedCmp = this.recentCmps.find((recentCmp) => {
            return recentCmp.id === event.target.dataset.id;
        });
        if(!clickedCmp) {
            return;
        } 

        this.selectMetadataType(clickedCmp.type);

        // Add the clicked component to the library of components, 
        // even if the listMetadata command hasn't finished for that 
        // metadata type yet. Make sure we don't add it twice.
        if(!this.mdTypesToCmps.hasOwnProperty(clickedCmp.type)) {
            this.mdTypesToCmps[clickedCmp.type] = [ clickedCmp ];
        } else {
            let cmpIndex = this.mdTypesToCmps[clickedCmp.type].findIndex((mdCmp) => {
                return mdCmp.fullName === clickedCmp.fullName;
            });
            if(cmpIndex < 0) {
                this.mdTypesToCmps[clickedCmp.type].push(clickedCmp);
            }
        }
        this.selectMetadataComponent(clickedCmp.fullName);
    }

    listMetadata() {
        return Promise.resolve();
    }

    getMetadataComponents(mdTypeName) {
        console.log('Listing Metadata...');
        this.listMetadata({
            metadataName : mdTypeName
        })
        .then(results => {
            console.log('List Metadata Complete.');
            let tmpMdCmps = JSON.parse(JSON.stringify(results));
            this.alphabeticSortByProp(tmpMdCmps, 'fullName');
            this.mdTypesToCmps[mdTypeName] = tmpMdCmps;
            this.fullListingMdTypes.add(mdTypeName);
        })
        .catch(error => {
            console.log(error);
        });
    }

    getDependencies() {
        return Promise.resolve();
    }

    queryMetadataDependencies(mdTypeName, mdCmpId) {
        console.log('Querying metadata dependencies...');
        this.getDependencies({ 
            mdTypeName : mdTypeName,
            mdCmpId : mdCmpId 
        })
        .then((result) => {
            console.log('Dependency query complete.');
            
            let tmpDependencies = [];
            for(let dependency of result.dependencies) {
                dependency.createdDate = this.formatDate(dependency.createdDate);
                dependency.lastModifiedDate = this.formatDate(dependency.lastModifiedDate);
                tmpDependencies.push(dependency);
            }
            let tmpRelDependencies = [];
            for(let dependency of result.relDependencies) {
                dependency.createdDate = this.formatDate(dependency.createdDate);
                dependency.lastModifiedDate = this.formatDate(dependency.lastModifiedDate);
                tmpRelDependencies.push(dependency);
            }
            this.dependencies = tmpDependencies;
            this.relDependencies = tmpRelDependencies;
        })
        .catch((error) => {
            console.log(error);
        });
    }

    queryFlowMetadata(flowName) {
        // getFlowMetadata({ flowName : flowName })
        // .then((result) => {
        //     console.log(JSON.stringify(result, null, 2));
        // })
        // .catch((error) => {
        //     console.log(error);
        // })
    }

    handleMetadataTypeSearch(event) {
        let searchString = event.detail.searchString.toLowerCase();
        if(!this.mdTypes) {
            return;
        }
        let tmpLookupMdTypes = [];
        for(let mdType of this.mdTypes) {
            if(mdType.xmlName.toLowerCase().includes(searchString)) {
                tmpLookupMdTypes.push(this.mapMetadataTypeToLookupMDType(mdType));
            }
        }
        this.lookupMdTypes = tmpLookupMdTypes;
    }

    handleMetadataTypeRemove(event) {
        this.selectedMdType = null;
        this.selectedMdCmp = null;
    }

    mapMetadataTypeToLookupMDType(metadataType) {
        return {
            name : metadataType.xmlName,
            subtitle : '',
            id : metadataType.xmlName,
            iconName : ''
        };
    }

    handleMetadataTypeSelect(event) {
        this.selectMetadataType(event.detail.selectedResult.name);
    }

    selectMetadataType(mdTypeName) {
        this.selectedMdType = mdTypeName;
        this.selectedMdCmp = null;
        this.dependencies = [];
        this.relDependencies = [];

        if(!this.fullListingMdTypes.has(this.selectedMdType)) {
            this.getMetadataComponents(this.selectedMdType);
        }
    }
    
    handleMetadataComponentSearch(event) {
        let searchString = event.detail.searchString.toLowerCase();
        if(!this.mdTypesToCmps.hasOwnProperty(this.selectedMdType)) {
            return;
        }
        let tmpLookupMdCmps = [];
        for(let mdCmp of this.mdTypesToCmps[this.selectedMdType]) {
            if(mdCmp.fullName.toLowerCase().includes(searchString)) {
                tmpLookupMdCmps.push(this.mapMetadataCmpToLookupMDCmp(mdCmp));
            }
        }
        this.lookupMdCmps = tmpLookupMdCmps;
    }

    handleMetadataComponentRemove(event) {
        this.selectedMdCmp = null;
        this.dependencies = [];
        this.relDependencies = [];
    }

    mapMetadataCmpToLookupMDCmp(mdCmp) {
        return {
            name : mdCmp.fullName,
            subtitle : '',
            id : mdCmp.fullName,
            iconName : ''
        };
    }

    handleMetadataComponentSelect(event) {
        this.selectMetadataComponent(event.detail.selectedResult.name);
    }

    selectMetadataComponent(mdCmpName) {
        this.selectedMdCmp = mdCmpName;

        this.saveComponentView();
        this.queryMetadataDependencies(this.activeMdCmp.type, this.activeMdCmp.id); 
    }

    saveMetadataComponents() {
        return Promise.resolve();
    }

    saveComponentView() {
        // Apply the viewed date of now to the component
        var isoDateString = new Date().toISOString();
        let tmpActiveCmp = JSON.parse(JSON.stringify(this.activeMdCmp));
        tmpActiveCmp.lastViewedDate = isoDateString;

        // Insert that component as the first one in the recent cmps list
        this.buildRecentComponents(this.recentCmps, tmpActiveCmp);
        
        this.saveMetadataComponents({
            mdCmps : [ tmpActiveCmp ]
        })
        .then(results => {
            console.log(JSON.stringify(results, null, 2));
        })
        .catch(error => {
            console.log(error);
        }); 
    }

    alphabeticSortByProp(objArray, propName) {
        objArray.sort((a, b) => a[propName].toLowerCase().localeCompare(b[propName].toLowerCase()));
        return objArray;
    }

    handleListItemDrag(event) {
        console.log('drag event');
        console.log('component being dragged: ' + event.detail.id);
    }

    handleItemDrop(event){
        console.log('drop event');

        let stage = event.detail;
        console.log(stage);
        // GR: Commented out for now
        //this.updateHandler(stage);
    }

    formatDate(isoDate) {
        return isoDate ? isoDate.split('T')[0] : '';
    }
    
    updateHandler(stage){
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.recordId;
        fields[STAGE_FIELD.fieldApiName] = stage;
        const recordInput = {fields};
        this.updateRecord(recordInput)
        .then(()=>{
            console.log("Updated Successfully");
            this.showToast();
            // GR: Temporarily deactivated for OSS
            // return refreshApex(this.wiredListView);
        }).catch(error=>{
            console.error(error)
        });
    }

    async updateRecord(recordInput) {
        return updateRecord(recordInput);
    }

    showToast(){
        // GR: Temporarily deactivated for OSS
        // this.dispatchEvent(
        //     new ShowToastEvent({
        //         title:'Success',
        //         message:'Stage updated Successfully',
        //         variant:'success'
        //     })
        // )
    }

}