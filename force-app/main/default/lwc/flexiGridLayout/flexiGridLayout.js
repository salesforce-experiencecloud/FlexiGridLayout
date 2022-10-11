/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from 'lwc';

/**
 * @slot region1
 * @slot region2
 * @slot region3
 * @slot region4
 * @slot region5
 * @slot region6
 * @slot region7
 * @slot region8
 * @slot region9
 * @slot region10
 * @slot region11
 * @slot region12
 */
export default class FlexiGridLayout extends LightningElement {
    isAura = false;
    isWarningPreview = false;
    warningMessage;
    @api stackRegions;
    @api regionCount;
    regionSizingArray = [];
    @api
    get regionSizing() {
        return this._regionSizing;
    }
    set regionSizing(value) {
        this._regionSizing = value;
        this.regionSizingArray = value.split(',');
    }
    @api verticalAlignment;
    @api classNames;
    regionSizeFallback;
    shouldRender2;
    shouldRender3;
    shouldRender4;
    shouldRender5;
    shouldRender6;
    shouldRender7;
    shouldRender8;
    shouldRender9;
    shouldRender10;
    shouldRender11;
    shouldRender12;

    connectedCallback() {
        if(window['$A'] !== undefined && window['$A'] !== null) {
            this.isAura = true;
        } else {
            this.regionSizeFallback = this.regionSizingArray.length > 0 ? this.regionSizingArray[0].trim() : 1;
            this.shouldRender2 = this.regionCount > 1;
            this.shouldRender3 = this.regionCount > 2;
            this.shouldRender4 = this.regionCount > 3;
            this.shouldRender5 = this.regionCount > 4;
            this.shouldRender6 = this.regionCount > 5;
            this.shouldRender7 = this.regionCount > 6;
            this.shouldRender8 = this.regionCount > 7;
            this.shouldRender9 = this.regionCount > 8;
            this.shouldRender10 = this.regionCount > 9;
            this.shouldRender11 = this.regionCount > 10;
            this.shouldRender12 = this.regionCount > 11;

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
            this.isWarningPreview = this.warningMessage !== '';
        }
    }

    get gridClass() {
        let gridClass = 'slds-grid slds-wrap';

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

    isInSitePreview() {
        let url = document.URL;
        
        return (url.indexOf('sitepreview') > 0 
            || url.indexOf('livepreview') > 0
            || url.indexOf('live-preview') > 0 
            || url.indexOf('live.') > 0
            || url.indexOf('.builder.') > 0);
    }

    getRegionClass(index) {
        //stackRegions:datasource:Never,On Mobile,On Mobile and Tablet,Always
        let regionClass = 'slds-col region region-' + (index + 1);
        let regionSize = this.regionSizingArray.length > index ? this.regionSizingArray[index].trim() : this.regionSizeFallback;
        if (this.stackRegions === 'Never') {
            regionClass += ' slds-size_' + regionSize + '-of-12';
        } else if (this.stackRegions === 'Always') {
            regionClass += ' slds-size_1-of-1';
        } else {
            regionClass += ' slds-size_1-of-1';
            let responsiveBreakpoint = this.stackRegions === 'On Mobile and Tablet' ? '-large' : '-medium';
            regionClass += ' slds' + responsiveBreakpoint + '-size_' + regionSize + '-of-12';
        }
        return regionClass;
    }

    get region1Class() {
        return this.getRegionClass(0);
    }

    get region2Class() {
        return this.getRegionClass(1);
    }

    get region3Class() {
        return this.getRegionClass(2);
    }

    get region4Class() {
        return this.getRegionClass(3);
    }

    get region5Class() {
        return this.getRegionClass(4);
    }

    get region6Class() {
        return this.getRegionClass(5);
    }

    get region7Class() {
        return this.getRegionClass(6);
    }

    get region8Class() {
        return this.getRegionClass(7);
    }

    get region9Class() {
        return this.getRegionClass(8);
    }

    get region10Class() {
        return this.getRegionClass(9);
    }

    get region11Class() {
        return this.getRegionClass(10);
    }

    get region12Class() {
        return this.getRegionClass(11);
    }
}