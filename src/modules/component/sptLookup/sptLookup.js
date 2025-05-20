import { LightningElement, track, api } from 'lwc';

export default class SptLookup extends LightningElement {
    // LABEL PARAMETERS
    @api label = '';
    @api hideLabel = false;
    @api hideIcons = false;

    // SELECTED VALUE PARAMETERS
    @track resultSelected = false;
    _selected;
    @api 
    get selected() {
        return this._selected;
    } 
    set selected(value) {
        this._selected = value;
        if(this._selected) {
            this.resultSelected = true;
        } else {
            this.resultSelected = false;
        }
    }
    
    // SEARCH ATTRIBUTES
    @track searchString = '';    
    @track searching = false;
    @track searchPopOver = false;
    @track searchLoading = false;
    @track _searchResults = [];
    @api
    get searchResults() {
        return this._searchResults;
    }
    set searchResults(value) {
        this._searchResults = value;
        if(this._searchResults < 1) {
            this.searchPopOver = false;
        }
        this.searchLoading = false;
    }

    get comboboxContainerClass() {
        if(this.resultSelected) {
            return 'slds-combobox_container slds-has-selection';  
        } else {
            return 'slds-combobox_container'; 
        }
    } 

    get comboboxClass() {
        if(this.searchPopOver) {
            return 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open';
        } else {
            return 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
        }
    }

    get comboboxFormElementClass() {
        if(this.hideIcons) {
            return 'slds-combobox__form-element slds-input-has-icon slds-input-has-icon_right';
        } else {
            return 'slds-combobox__form-element slds-input-has-icon slds-input-has-icon_left-right';    
        }
    }   
    
    search(event){
        this.searchPopOver = true;
        this.searchLoading = true;
        let searchStr = event.target.value;
        let helper = this;
        if(searchStr.length < 2) {
            this.searchPopOver = false;
        }
        
        if(!this.searching){
            this.searching = true;
            this.timeout = setTimeout(() => {
                this.searching = false;
                helper.getResultsBySearchString(searchStr);
            }, 400, "this");
        } else {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.searching = false;
                helper.getResultsBySearchString(searchStr);
            }, 400, "this");
        }
    }

    getResultsBySearchString(searchStr){
        const selectEvent = new CustomEvent('search', { detail: {
            searchString: searchStr
        }});
        this.dispatchEvent(selectEvent);
    }

    handleSelect(event) {
        let selectedResultId = event.currentTarget.dataset.id;
        let selectedResult;
        for(let searchResult of this.searchResults) {
            if(searchResult.id === selectedResultId) {
                selectedResult = searchResult;
            }
        }
        const selectEvent = new CustomEvent('select', { detail: {
            selectedResult: selectedResult
        }});
        this.dispatchEvent(selectEvent);
        this.selected = selectedResult;
        this.searchPopOver = false;
        this.searchString = '';
    }

    handleDeselect() {
        const selectEvent = new CustomEvent('deselect', {});
        this.dispatchEvent(selectEvent);
        this.selected = null;
    }
}