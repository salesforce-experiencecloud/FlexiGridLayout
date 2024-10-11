/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from 'lwc';
import * as generalUtils from 'c/gtaUtilsGeneral';
import * as deviceUtils from 'c/gtaUtilsDevice';
import {isAura, isInSitePreview} from 'c/gtaUtilsExperience';


const regionNames = ['SaaSy','Astro','Einstein','Codey','Cloudy','Brandy','Ruth','Zig','Koa','Flo','Appy','Max'];

/**
 * @slot SaaSy
 * @slot Astro
 * @slot Einstein
 * @slot Codey
 * @slot Cloudy
 * @slot Brandy
 * @slot Ruth
 * @slot Zig
 * @slot Koa
 * @slot Flo
 * @slot Appy
 * @slot Max
 */

export default class FlexiGridLayout2 extends LightningElement {

    @api configJSONString = '{}';

    get configObj() {
        return JSON.parse(this.configJSONString);
    }

    get regionObj() {
        let regionObj = (generalUtils.isObjectEmpty(this.configObj.hasOwnProperty(this.formFactor))) 
        ? undefined : generalUtils.getObjPropValue(this.configObj, this.formFactor);
        return regionObj;
    }

    get isAura() {
        return isAura();
    }

    get isPreview() {
        return isInSitePreview();
    }

    get showRegionNames()
    {
        return this.hideRegionNamesInBuilder === false && this.isPreview === true;
    }

    get formFactor() {
        let formFactorSize = deviceUtils.convertWidthToFormFactor(this.windowWidth);
        if(formFactorSize === 'Small')
        {
            return 'mobile';
        }
        else if(formFactorSize === 'Medium')
        {
            return 'tablet';
        }
        else 
        {
            return 'desktop';
        }
    }

    get regionList() {

        let regionList = [];
        
        if(generalUtils.isObjectEmpty(this.regionObj) === false)
        {
            for(let i=0;i<regionNames.length;i++)
            {
                if(this.regionObj.hasOwnProperty(regionNames[i]))
                {
                    let regionConfig =  generalUtils.getObjPropValue(this.regionObj, regionNames[i]);

                    let tmpRegion = (generalUtils.isObjectEmpty(regionConfig) === false) ? JSON.parse(JSON.stringify(regionConfig)) : {};
                    tmpRegion.showRegion = tmpRegion.size !== '0';
                    tmpRegion.classNames = this.getRegionClass(tmpRegion);
                    this.setIsRegionProperties(tmpRegion);
           
                    regionList.push(tmpRegion);
                    
                }
            }
        }

        if(generalUtils.isArrayEmpty(regionList) === false)
        {
            regionList.sort((a, b) => (a.order > b.order ? 1 : -1));
        }

        return regionList;

    }

    get regionListNotEmpty() {
        return generalUtils.isArrayEmpty(this.regionList) === false;
    }

    get verticalAlignment() {
        let tmpvalue = (generalUtils.isStringEmpty(this.regionObj?.styles?.verticalAlignment) || this.regionObj?.styles?.verticalAlignment.trim() === 'undefined') 
        ? 'Centered' : this.regionObj?.styles?.verticalAlignment;
        return tmpvalue;
    }

    get classNames() {
        let tmpvalue = (generalUtils.isStringEmpty(this.regionObj?.styles?.classNames) || this.regionObj?.styles?.classNames.trim() === 'undefined') 
        ? '' : this.regionObj?.styles?.classNames;
        return tmpvalue;
    }

    get hideRegionNamesInBuilder() {
        let tmpvalue = (generalUtils.isStringEmpty(this.configObj?.hideRegionNamesInBuilder)) 
        ? false : this.configObj?.hideRegionNamesInBuilder;
        return tmpvalue;
    }

    get gridClass() {
        let gridClass = 'slds-grid';

        if(this.noWrap === false)
        {
            gridClass += ' slds-wrap';
        }

        let alignClass = 'slds-grid_vertical-align-center';
        if (this.verticalAlignment === 'Top') {
            alignClass = 'slds-grid_vertical-align-start';
        } else if (this.verticalAlignment === 'Bottom') {
            alignClass = 'slds-grid_vertical-align-end';
        }
        gridClass += ' ' + alignClass;

        if (this.classNames) {
            gridClass += ' ' + this.classNames;
        }
        return gridClass;
    }

    windowWidth = window.innerWidth;
    isWarningPreview = false;
    slotsReady = false;
    warningMessage;
    resizeListener;
    noWrap = false;
  
    renderedCallback() {
        if(this.slotsReady === false)
        {
            if(generalUtils.isArrayEmpty(this.regionList) === false)
            {
                this.slotsReady = true;
            }
        }
    }

    connectedCallback() {

        this.resizeListener = generalUtils.debounce(this.handleResize.bind(this), 500);
        window.addEventListener('resize', this.resizeListener);

        /*
        if(this.isAura === false) 
        {

            this.warningMessage = '';
            if (this.isInSitePreview()) {
                if (this.regionCount > this.regionSizingArray.length) {
                    this.warningMessage += 'The Number of Regions is greater than the Region Sizing defined. ';
                } else if (this.regionCount < this.regionSizingArray.length) {
                    this.warningMessage += 'The Number of Regions is less than the Region Sizing defined. ';
                }

                let totalSizing = 0;
                let valueNotAnInteger = false;
                let valueOutOfRange = false;
                for (var i = 0; i < this.regionSizingArray.length; i++) {
                    let regionSize = Number(this.regionSizingArray[i].trim());
                    if (Number.isInteger(regionSize)) {
                        totalSizing += regionSize;
                    } else {
                        valueNotAnInteger = true;
                    }
                    if (regionSize > 12 || regionSize < 1) {
                        valueOutOfRange = true;
                    }
                }
                if (totalSizing % 12 != 0) {
                    this.warningMessage += 'Region Sizing typically totals 12 per row. ';
                }
                if (valueNotAnInteger) {
                    this.warningMessage += 'All comma separated Region Sizes should be an integer. ';
                }
                if (valueOutOfRange) {
                    this.warningMessage += 'Valid comma separated Region Sizes are 1 through 12. ';
                }
            }
            this.isWarningPreview = (this.warningMessage !== '' && this.isPreview === true);
        }
        */

    }


    handleResize() {
        try {
            const oldFormFactor = this.formFactor;
            this.windowWidth = window.innerWidth;
            const newFormFactor = this.formFactor;

            if(oldFormFactor !== newFormFactor)
            {
                this.slotsReady = false;
            }

        } catch(err){}
    }

    setIsRegionProperties(region) {
        for(let i=0; i<regionNames.length; i++)
        {
            let propName = 'is' + regionNames[i];
            generalUtils.setObjPropValue(region, propName, region.name === regionNames[i]);
        }
    }

    getRegionClass(region) {

        let regionClass = 'slds-col region region-' + region.name;
        
        if(region.size === 'fit-content')
        {
            regionClass += ' fit-content';
            this.noWrap = true;
        }
        else if(region.size === 'available-space')
        {
            regionClass += ' available-space';
            this.noWrap = true;
        }
        else 
        {
            regionClass += ' slds-size_' + region.size + '-of-12';
        }

        if(generalUtils.isStringEmpty(region.horizontalAlignment) === false && region.horizontalAlignment !== 'default')
        {
            regionClass += ' align-horizontal-' + region.horizontalAlignment;
        }

        return regionClass;
    }


}