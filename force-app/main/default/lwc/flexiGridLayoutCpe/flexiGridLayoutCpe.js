import { LightningElement, track, api } from 'lwc';
import * as generalUtils from 'c/gtaUtilsGeneral';
import * as componentUtils from 'c/gtaUtilsComponent';
import ToastContainer from 'lightning/toastContainer';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

const typeDelay = 1000;
const defaultCSSClasses = 'slds-m-bottom_medium';
const propertyEditorWidthStyle = ':root {--cb-property-editor-width: 650px;}';
const regionNames = ['SaaSy','Astro','Einstein','Codey','Cloudy','Brandy','Ruth','Zig','Koa','Flo','Appy','Max'];


export default class FlexiGridLayoutCpe extends LightningElement {

    uuid = generalUtils.generateUniqueIdentifier();
    
    @track propInputs = {
        /*
            template: {
                key: 'template', //key used for html lightning-input tag identifier, must match key in propInputs
                label: 'Template', //label used for html lighting-input tag
                type: 'text', //type used for html lightning-input tag
                help: 'template', //tooltip / help text used for html lightning-input tag
                required: false, //required used for html lightning-input tag
                valuePath: 'general.template', //property path within the value object
                value: '', //default value
                doSetDefaultValue: true, //set to true to set this lightning-input's default value to what is stored in the value object
                classes: defaultCSSClasses + '', //css classes for html lightning-input tag
                changeHandler: this.handleTestChange, //onchange handler for html lightning-input tag
            },
        */
            formFactorConfig: {
                key: 'formFactorConfig', //key used for html lightning-input tag identifier, must match key in propInputs
                label: 'Show Settings For View Mode:', //label used for html lighting-input tag
                type: 'select', //type used for html lightning-input tag
                help: 'Choose which Form Factor Settings to see. When in Builder View Mode, switch view mode in builder to configure settings for a specific view mode.', //tooltip / help text used for html lightning-input tag
                required: false, //required used for html lightning-input tag
                valuePath: 'formFactorConfig', //property path within the value object
                value: 'Builder View Mode', //default value
                doSetDefaultValue: false, //set to true to set this lightning-input's default value to what is stored in the value object
                classes: defaultCSSClasses + ' slds-m-top_medium slds-size_12-of-12 slds-p-horizontal_medium', //css classes for html lightning-input tag
                changeHandler: this.handleFormFactorConfigChange, //onchange handler for html lightning-input tag
                options:[
                    {label: 'Builder View Mode', value: 'Builder View Mode'},
                    {label: 'All', value: 'All'}
                ],
            },
            verticalAlignment: {
                key: 'verticalAlignment', //key used for html lightning-input tag identifier, must match key in propInputs
                label: 'Vertical Alignment:', //label used for html lighting-input tag
                type: 'select', //type used for html lightning-input tag
                help: 'Vertical alignment of content within columns.', //tooltip / help text used for html lightning-input tag
                required: false, //required used for html lightning-input tag
                valuePath: this.formFactor.toLowerCase() + '.styles.verticalAlignment', //property path within the value object
                value: 'Centered', //default value
                doSetDefaultValue: false, //set to true to set this lightning-input's default value to what is stored in the value object
                classes: defaultCSSClasses + ' slds-m-top_medium slds-size_12-of-12', //css classes for html lightning-input tag
                changeHandler: this.handleVerticalAlignmentChange, //onchange handler for html lightning-input tag
                options:[
                    {label: 'Top', value: 'Top'},
                    {label: 'Centered', value: 'Centered'},
                    {label: 'Bottom', value: 'Bottom'}
                ],
            },
            classNames: {
                key: 'classNames', //key used for html lightning-input tag identifier, must match key in propInputs
                label: 'CSS Classes', //label used for html lighting-input tag
                type: 'text', //type used for html lightning-input tag
                help: 'CSS Class names to uniquely target the region\'s styles', //tooltip / help text used for html lightning-input tag
                required: false, //required used for html lightning-input tag
                valuePath: this.formFactor.toLowerCase() + '.styles.classNames', //property path within the value object
                value: '', //default value
                doSetDefaultValue: false, //set to true to set this lightning-input's default value to what is stored in the value object
                classes: defaultCSSClasses + '', //css classes for html lightning-input tag
                changeHandler: this.handleClassNameChange, //onchange handler for html lightning-input tag
            },
            desktopConfig: {
                key: 'desktopConfig', //key used for html lightning-input tag identifier, must match key in propInputs
                label: 'Desktop Configuration', //label used for html lighting-input tag
                type: 'Object', //type used for html lightning-input tag
                help: 'Configure for Desktop.', //tooltip / help text used for html lightning-input tag
                required: false, //required used for html lightning-input tag
                valuePath: 'desktop', //property path within the value object
                value: this.defaultConfig, //default value
                doSetDefaultValue: true, //set to true to set this lightning-input's default value to what is stored in the value object
                classes: defaultCSSClasses + 'slds-m-top_medium', //css classes for html lightning-input tag
                clickHandler: undefined, //onchange handler for html lightning-input tag
            },
            tabletConfig: {
                key: 'tabletConfig', //key used for html lightning-input tag identifier, must match key in propInputs
                label: 'Tablet Configuration', //label used for html lighting-input tag
                type: 'Object', //type used for html lightning-input tag
                help: 'Configure for Tablet.', //tooltip / help text used for html lightning-input tag
                required: false, //required used for html lightning-input tag
                valuePath: 'tablet', //property path within the value object
                value: this.defaultConfig, //default value
                doSetDefaultValue: true, //set to true to set this lightning-input's default value to what is stored in the value object
                classes: defaultCSSClasses + 'slds-m-top_medium', //css classes for html lightning-input tag
                clickHandler: undefined, //onchange handler for html lightning-input tag
            },
            mobileConfig: {
                key: 'mobileConfig', //key used for html lightning-input tag identifier, must match key in propInputs
                label: 'Mobile Configuration', //label used for html lighting-input tag
                type: 'Object', //type used for html lightning-input tag
                help: 'Configure for Mobile.', //tooltip / help text used for html lightning-input tag
                required: false, //required used for html lightning-input tag
                valuePath: 'mobile', //property path within the value object
                value: this.defaultConfig, //default value
                doSetDefaultValue: true, //set to true to set this lightning-input's default value to what is stored in the value object
                classes: defaultCSSClasses + 'slds-m-top_medium', //css classes for html lightning-input tag
                clickHandler: undefined, //onchange handler for html lightning-input tag
            },
            hideRegionNamesInBuilder: {
                key: 'hideRegionNamesInBuilder', //key used for html lightning-input tag identifier, must match key in propInputs
                label: 'Hide Region Names in Builder', //label used for html lighting-input tag
                type: 'toggle', //type used for html lightning-input tag
                help: 'Hide or Show Region Names in builder', //tooltip / help text used for html lightning-input tag
                required: false, //required used for html lightning-input tag
                valuePath: 'hideRegionNamesInBuilder', //property path within the value object
                value: false, //default value
                doSetDefaultValue: true, //set to true to set this lightning-input's default value to what is stored in the value object
                classes: defaultCSSClasses + ' slds-p-horizontal_medium display_inline-block ', //css classes for html lightning-input tag
                changeHandler: this.handleHideRegionNamesInBuilderChange, //onchange handler for html lightning-input tag
            },
    };

    @api
    get value() {
        return this._value;
    }

    set value(value) {
       
        let valuetmp = JSON.parse(value);
        let isValueUndefined = this._value === undefined;
        this._value = {};
        let hasValueChanged = false;

        for (let key in this.propInputs) {
            
            if(generalUtils.objectHasProperty(this.propInputs, key) && this.propInputs[key].doSetDefaultValue === true)
            {
                let tmpVal = generalUtils.getObjPropValue(valuetmp, this.propInputs[key].valuePath);
                if(generalUtils.isObjectEmpty(tmpVal))
                {
                    tmpVal = this.propInputs[key].value;
                    if(((this.propInputs[key].type === 'text' || this.propInputs[key].type === 'select' ||  this.propInputs[key].type === 'search') 
                        && !generalUtils.isStringEmpty(tmpVal)) 
                        ||
                        ((this.propInputs[key].type === 'Object' || this.propInputs[key].type === 'toggle' || this.propInputs[key].type === 'checkbox' || this.propInputs[key].type === 'number' ) && !generalUtils.isObjectEmpty(tmpVal)))
                    {
                        valuetmp = generalUtils.setObjPropValue(valuetmp, this.propInputs[key].valuePath, tmpVal);
                        value = JSON.stringify(valuetmp);
                        hasValueChanged = true;
                    }
                    
                } 
                if(this.propInputs[key].value !== tmpVal)
                {
                    if(this.propInputs[key].type === 'Object' && key === 'desktopConfig')
                    {
                        //this.criteriaMapTmp = generalUtils.cloneObjectWithJSON(tmpVal);
                    }
                    this.propInputs[key].value = tmpVal;
                    if(this.propInputs[key].type === 'Object' && (key === 'desktopConfig' || key === 'tabletConfig' || key === 'mobileConfig'))
                    {
                        this.propInputs[key].value.regionList = [];
                        for(let i=0; i<regionNames.length;i++)
                        {
                            if(generalUtils.objectHasProperty(this.propInputs[key].value, regionNames[i]))
                            {
                                this.propInputs[key].value.regionList.push(generalUtils.getObjPropValue(this.propInputs[key].value, regionNames[i]));
                            }
                        }
                        this.propInputs[key].value.regionList.sort((a, b) => (a.order > b.order ? 1 : -1));
                    }
                }
            }

            

        }

        this._value = value;
        if(hasValueChanged === true)
        {
            this.dispatchEvent(new CustomEvent("valuechange", 
            {detail: {value: value}}));
        }
    }

    
    activeTab;
    exportError;
    importError;
    importModalOpen = false;

    get formFactor() {
        
        let lastSiteId = generalUtils.getCookie('lastSiteId');
        if(generalUtils.isStringEmpty(lastSiteId) === true)
        {
            return 'Desktop';
        }
        else 
        {
            let cookieList = document.cookie.split(';');
            let filteredCookieList = cookieList.filter( item => (item.includes('PicassoViewMode') === true && item.includes(lastSiteId) === true));
            if(generalUtils.isArrayEmpty(filteredCookieList) === true)
            {
                return 'Desktop';
            }
            else 
            {
                let tmpFormFactor = filteredCookieList[filteredCookieList.length-1].split('=')[1];
                tmpFormFactor = (generalUtils.isStringEmpty(tmpFormFactor) === true ) ? 'Desktop' : tmpFormFactor;
                return tmpFormFactor;
            }
        }
        
    }

    get showDesktopTab() {
        
        return this.propInputs.formFactorConfig.value === 'All' || (this.propInputs.formFactorConfig.value === 'Builder View Mode' && this.formFactor === 'Desktop');
    }

    get showTabletTab() {
        return this.propInputs.formFactorConfig.value === 'All' || (this.propInputs.formFactorConfig.value === 'Builder View Mode' && this.formFactor === 'Tablet');
    }

    get showMobileTab() {
        return this.propInputs.formFactorConfig.value === 'All' || (this.propInputs.formFactorConfig.value === 'Builder View Mode' && this.formFactor === 'Mobile');
    }

    get regionNameList() {
        return regionNames;
    }

    get defaultConfig() {
        let tmpConfig = {};
        tmpConfig.styles = {};
        tmpConfig.styles.classNames = '';
        tmpConfig.styles.verticalAlignment = 'Centered';
        let tmpRegionList = [];
        for(let i=0;i<regionNames.length;i++)
        {
            let tmpRegion = {
                name: regionNames[i],
                size: (i < 3) ? '4' : '0',
                showRegion: (i < 3) ? true : false,
                horizontalAlignment: 'default',
                order: i+1
            };
            generalUtils.setObjPropValue(tmpConfig, regionNames[i], tmpRegion);
            tmpRegionList.push(tmpRegion);
        }
        tmpConfig.regionList = tmpRegionList;
        tmpConfig.regionList.sort((a, b) => (a.order > b.order ? 1 : -1));
        return tmpConfig;
    }

    get sizeOptions() {
        let tmpSizeOptions = [];
        for(let i=0;i<13;i++)
        {
            tmpSizeOptions.push({ label: i+'', value: i+'' });
        }
        tmpSizeOptions.push({label: 'Fit Content', value:'fit-content'});
        tmpSizeOptions.push({label: 'Available Space', value:'available-space'});
        return tmpSizeOptions;
    } 

    get horizontalAlignmentOptions() {
        let tmpHorizontalAlignmentOptions = [];
        tmpHorizontalAlignmentOptions.push({label: 'Default', value:'default'});
        tmpHorizontalAlignmentOptions.push({label: 'Left', value:'left'});
        tmpHorizontalAlignmentOptions.push({label: 'Center', value:'center'});
        tmpHorizontalAlignmentOptions.push({label: 'Right', value:'right'});
        
        return tmpHorizontalAlignmentOptions;
    } 

    get orderOptions() {
        let tmpOrderOptions = [];
        for(let i=1;i<13;i++)
        {
            tmpOrderOptions.push({ label: i+'', value: i+'' });
        }
        return tmpOrderOptions;
    } 

    getValueObj()
    {
        let tmpvalueObj = (generalUtils.isStringEmpty(this.value)) ? {} : JSON.parse(this.value);
        return tmpvalueObj;
    }

    get modalClass() {
        let classNames = 'slds-modal slds-modal_large slds-fade-in-open';
        return classNames;
    }

    get displayBackdrop() {
        return this.importModalOpen;
    }

    connectedCallback() {

        let styleEl = document.createElement('style');
        styleEl.classList.add('flexigrid-' + this.uuid);
        styleEl.innerHTML = propertyEditorWidthStyle;
        document.body.appendChild(styleEl);


    }

    disconnectedCallback() {
        let styleEl = document.body.querySelector('style.flexigrid-' + this.uuid);
        if(generalUtils.isObjectEmpty(styleEl) === false)
        {
            styleEl.remove();
        }
    }

    handleActiveTab(e) {
        this.activeTab = e.target.value;
    }

    handleFormFactorConfigChange(e) {

        let selectedValue = e.detail.value;
        this.propInputs.formFactorConfig.value = selectedValue;
        
    }

    handleVerticalAlignmentChange(e) {

        let selectedValue = e.detail.value;
        this.propInputs = generalUtils.setObjPropValue(this.propInputs, this.activeTab.toLowerCase() + 'Config.value.styles.verticalAlignment', selectedValue);

        let tmpvalueObj = this.getValueObj();
        tmpvalueObj = generalUtils.setObjPropValue(tmpvalueObj, this.activeTab.toLowerCase() + '.styles.verticalAlignment', selectedValue);

        this.dispatchEvent(new CustomEvent("valuechange", 
            {detail: {value: JSON.stringify(tmpvalueObj)}}));

    }

    handleClassNameChange(e) {

        window.clearTimeout(this.propInputs.classNames.textDelayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.propInputs.classNames.textDelayTimeout = setTimeout(() => {

            let inputvalue = e.detail.value.trim();
            this.propInputs = generalUtils.setObjPropValue(this.propInputs, this.activeTab.toLowerCase() + 'Config.value.styles.classNames', inputvalue);

            let tmpvalueObj = this.getValueObj();
            tmpvalueObj = generalUtils.setObjPropValue(tmpvalueObj, this.activeTab.toLowerCase() + '.styles.classNames', inputvalue);

            this.dispatchEvent(new CustomEvent("valuechange", 
                {detail: {value: JSON.stringify(tmpvalueObj)}}));

        }, typeDelay);

    }

    handleSizeChange(e) {
        let currId = e.target.dataset.id;
        let inputvalue = e.detail.value;
        this.propInputs = generalUtils.setObjPropValue(this.propInputs, this.activeTab.toLowerCase() + 'Config.value.' + currId + '.size', inputvalue);
        this.propInputs = generalUtils.setObjPropValue(this.propInputs, this.activeTab.toLowerCase() + 'Config.value.' + currId + '.showRegion', inputvalue !== '0');

        let tmpvalueObj = this.getValueObj();
        tmpvalueObj = generalUtils.setObjPropValue(tmpvalueObj, this.activeTab.toLowerCase() + '.' + currId + '.size', inputvalue);
        tmpvalueObj = generalUtils.setObjPropValue(tmpvalueObj, this.activeTab.toLowerCase() + '.' + currId + '.showRegion', inputvalue !== '0');


        this.dispatchEvent(new CustomEvent("valuechange", 
            {detail: {value: JSON.stringify(tmpvalueObj)}}));

    }

    handleOrderChange(e) {
        let currId = e.target.dataset.id;
        let index = parseInt(e.target.dataset.index);
        let inputvalue = parseInt(e.detail.value);
        let newIndex = inputvalue - 1;

        let configValue = generalUtils.cloneObjectWithJSON( generalUtils.getObjPropValue(this.propInputs, this.activeTab.toLowerCase() + 'Config.value' ));
        
        let tmpvalueObj = this.getValueObj();
                
        if(newIndex > index)
        {
            configValue.regionList.splice(inputvalue, 0, configValue.regionList[index]);
            configValue.regionList.splice(index,1);
        }
        else if(newIndex < index)
        {
            configValue.regionList.splice(newIndex, 0, configValue.regionList[index]);
            configValue.regionList.splice(index+1,1);
        }
        
        for(let i=0; i<configValue.regionList.length;i++)
        {
            configValue.regionList[i].order = i+1;
            configValue = generalUtils.setObjPropValue(configValue, configValue.regionList[i].name, configValue.regionList[i]);
            tmpvalueObj = generalUtils.setObjPropValue(tmpvalueObj, this.activeTab.toLowerCase() + '.' + configValue.regionList[i].name, configValue.regionList[i]);
        }


        this.propInputs = generalUtils.setObjPropValue(this.propInputs, this.activeTab.toLowerCase() + 'Config.value', configValue);

        
        tmpvalueObj = generalUtils.setObjPropValue(tmpvalueObj, this.activeTab.toLowerCase() + '.' + currId + '.order', inputvalue);

        this.dispatchEvent(new CustomEvent("valuechange", 
            {detail: {value: JSON.stringify(tmpvalueObj)}}));
        
    }

    handleHorizontalAlignmentChange(e) {
        let currId = e.target.dataset.id;
        let inputvalue = e.detail.value;
        this.propInputs = generalUtils.setObjPropValue(this.propInputs, this.activeTab.toLowerCase() + 'Config.value.' + currId + '.horizontalAlignment', inputvalue);

        let tmpvalueObj = this.getValueObj();
        tmpvalueObj = generalUtils.setObjPropValue(tmpvalueObj, this.activeTab.toLowerCase() + '.' + currId + '.horizontalAlignment', inputvalue);

        this.dispatchEvent(new CustomEvent("valuechange", 
            {detail: {value: JSON.stringify(tmpvalueObj)}}));
    }

    handleCopy(e) {
        
        let source = e.target.dataset.source;
        let sourceConfigValue = generalUtils.cloneObjectWithJSON( generalUtils.getObjPropValue(this.propInputs, source.toLowerCase() + 'Config.value' ));
        this.propInputs = generalUtils.setObjPropValue(this.propInputs, this.activeTab.toLowerCase() + 'Config.value', sourceConfigValue);

        let tmpvalueObj = this.getValueObj();

        tmpvalueObj = generalUtils.setObjPropValue(tmpvalueObj, this.activeTab.toLowerCase(), sourceConfigValue);

        this.dispatchEvent(new CustomEvent("valuechange", 
            {detail: {value: JSON.stringify(tmpvalueObj)}}));

        const evt = new ShowToastEvent({
            title: 'Copied from ' + source,
            message: ' ',
            variant: 'success',
            });
            this.dispatchEvent(evt);

    }

    handleExportConfig(e)
    {
        this.exportError = undefined;
        let tmpvalueObj = this.getValueObj();
        if(generalUtils.isObjectEmpty(tmpvalueObj) === false)
        {
            generalUtils.downloadTextFile('Flexi-grid-Layout-config.json', JSON.stringify(tmpvalueObj, undefined, 4));
        }
        else
        {
            this.exportError = 'Config not found.';
        }
    }

    openImportModal() 
    {
        this.importModalOpen = true;
    }

    closeImportModal() 
    {
        this.importModalOpen = false;
    }

    handleImportConfig(e)
    {
        this.importError = undefined;
        let fileElement = componentUtils.getElement(this, 'input[data-name="importConfigFile"]');

        generalUtils.readTextFile(fileElement).then(
            (result) => {
                let JSONConfigImportString = result;
                console.log(JSONConfigImportString);
                let JSONConfigImport;
                try {
                    JSONConfigImport = JSON.parse(JSONConfigImportString);
                } catch(err) {
                    this.importError = 'Error parsing JSON: ' + err;
                }

                try {

                    if(!generalUtils.isObjectEmpty(JSONConfigImport))
                    {
                        let tmpvalueObj = this.getValueObj();
                        let hasValueChanged = false;
                        let formFactorList = ['desktop','tablet','mobile'];
                        for (let i=0;i<formFactorList.length;i++) 
                        {
                            
                            let tmpVal = generalUtils.getObjPropValue(JSONConfigImport, formFactorList[i]);
                            if(generalUtils.isObjectEmpty(tmpVal) === false)
                            {
                                let tmpValOld = generalUtils.getObjPropValue(tmpvalueObj, formFactorList[i]);
                                if(generalUtils.isObjectEmpty(tmpValOld) === false && tmpValOld !== tmpVal)
                                {
                                    tmpvalueObj = generalUtils.setObjPropValue(tmpvalueObj, formFactorList[i], tmpVal);
                                    hasValueChanged = true;
                                }
                                
                            }
                            
                        }

                        if(hasValueChanged)
                        {
                            this.closeImportModal();
                            
                            this.dispatchEvent(new CustomEvent("valuechange", 
                            {detail: {value: JSON.stringify(tmpvalueObj)}}));
                        }
                        else
                        {
                            this.importError = 'No values to import found. ';
                        }

                    }
                } catch(err2) {
                    this.importError = 'Error during import: ' + err2;
                }
            },
            (error) => {
                this.importError = error + '';
            }
        );
            
                
        
    }

    handleHideRegionNamesInBuilderChange(e) {
        this.propInputs.hideRegionNamesInBuilder.value = e.detail.checked;

        let tmpvalueObj = this.getValueObj();
        tmpvalueObj.hideRegionNamesInBuilder = this.propInputs.hideRegionNamesInBuilder.value;

        this.dispatchEvent(new CustomEvent("valuechange", 
            {detail: {value: JSON.stringify(tmpvalueObj)}}));
    }

}