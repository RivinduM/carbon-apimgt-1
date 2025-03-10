/**
 * Copyright (c) 2020, WSO2 Inc. (http://wso2.com) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import cloneDeep from 'lodash.clonedeep';
import Utils from './Utils';
import MockResponses from './MockResponses';
import APIClientFactory from './APIClientFactory';

/**
  * An abstract representation of a Service Catalog
  */
class ServiceCatalog {
    constructor(kwargs) {
        this.client = new APIClientFactory().getAPIClient(Utils.getCurrentEnvironment(),
            Utils.CONST.SERVICE_CATALOG_CLIENT).client;
        const properties = kwargs;
        Utils.deepFreeze(properties);
        this._data = properties;
        for (const key in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, key)) {
                this[key] = properties[key];
            }
        }
    }

    /**
     * @param data
     * @returns {object} Metadata for API request
     */
    static _requestMetaData(data = {}) {
        return {
            requestContentType: data['Content-Type'] || 'application/json',
        };
    }

    /**
     *
     * Instance method of the ServiceCatalog class to provide raw JSON object
     * which is Service body friendly to use with REST api requests
     * Use this method instead of accessing the private _data object for
     * converting to a JSON representation of an API object.
     * Note: This is deep coping, Use sparingly, Else will have a bad impact on performance
     * Basically this is the revers operation in constructor.
     * This method simply iterate through all the object properties (excluding the properties in `excludes` list)
     * and copy their values to new object.
     * So use this method with care!!
     * @memberof API
     * @param {Array} [userExcludes=[]] List of properties that are need to be excluded from the generated JSON object
     * @returns {JSON} JSON representation of the API
     */
    toJSON(userExcludes = []) {
        const copy = {};
        const excludes = [...userExcludes];
        for (const prop in this) {
            if (!excludes.includes(prop)) {
                copy[prop] = cloneDeep(this[prop]);
            }
        }
        return copy;
    }

    /**
     * Add sample service
     * @returns {promise} Add sample promise.
     */
    static addService(serviceMetadata, inlineContent) {
        const serviceCatalog = new APIClientFactory()
            .getAPIClient(Utils.getCurrentEnvironment(), Utils.CONST.SERVICE_CATALOG_CLIENT)
            .client;
        const promisedCatalogSampleService = serviceCatalog.then((client) => {
            return client.apis.Services
                .addService({}, {
                    requestBody: {
                        serviceMetadata: `${JSON.stringify(serviceMetadata)};type=application/json`,
                        inlineContent: JSON.stringify(inlineContent),
                    },
                }, this._requestMetaData({
                    'Content-Type': 'multipart/form-data',
                }));
        });
        return promisedCatalogSampleService.then((response) => response.body);
    }

    /**
     * Get Settings
     * @returns {promise} Settings promise.
     */
    static getSettings() {
        const serviceCatalog = new APIClientFactory()
            .getAPIClient(Utils.getCurrentEnvironment(), Utils.CONST.SERVICE_CATALOG_CLIENT)
            .client;
        const promisedServiceCatalogSettings = serviceCatalog.then(() => {
            // return client.apis['Services'].getSettings();
            return MockResponses.getSettings();
        });
        return promisedServiceCatalogSettings.then((response) => response.body);
    }

    /**
     * Get details of Services
     * @returns {promise} Service Entry promise.
     */
    static searchServices() {
        const serviceCatalog = new APIClientFactory()
            .getAPIClient(Utils.getCurrentEnvironment(), Utils.CONST.SERVICE_CATALOG_CLIENT)
            .client;
        return serviceCatalog.then((client) => {
            return client.apis.Services.searchServices();
        });
    }

    /**
     * Get details of Service by key
     * @returns {promise} Service Entry promise.
     */
    static searchServiceByKey(key) {
        const serviceCatalog = new APIClientFactory()
            .getAPIClient(Utils.getCurrentEnvironment(), Utils.CONST.SERVICE_CATALOG_CLIENT)
            .client;
        const promisedServices = serviceCatalog.then((client) => {
            return client.apis.Services.searchServices(
                {
                    key,
                },
                this._requestMetaData(),
            );
        });
        return promisedServices.then((response) => response.body);
    }

    /**
     * Check Existence of a Service
     * @param id {string} UUID of the service.
     * @returns {promise} Promise.
     */
    static checkServiceExistence() {
        const serviceCatalog = new APIClientFactory()
            .getAPIClient(Utils.getCurrentEnvironment(), Utils.CONST.SERVICE_CATALOG_CLIENT)
            .client;
        const promisedService = serviceCatalog.then(() => {
            // return client.apis['Services'].checkServiceExistence(
            //     {
            //         serviceId: id,
            //     },
            //     this._requestMetaData()
            // );
            return MockResponses.checkServiceExistence();
        });
        return promisedService.then((response) => response.body);
    }

    /**
     * Create a Service
     * @param body {Object} Service body.
     * @returns {promise} Promise.
     */
    static createService() {
        const serviceCatalog = new APIClientFactory()
            .getAPIClient(Utils.getCurrentEnvironment(), Utils.CONST.SERVICE_CATALOG_CLIENT)
            .client;
        const promisedService = serviceCatalog.then(() => {
            // return client.apis['Services'].createService(
            //     body,
            //     this._requestMetaData()
            // );
            return MockResponses.createService();
        });
        return promisedService.then((response) => response.body);
    }

    /**
     * Delete a Service
     * @param id {string} UUID of the service.
     * @returns {promise} Promise.
     */
    static deleteService(id) {
        const serviceCatalog = new APIClientFactory()
            .getAPIClient(Utils.getCurrentEnvironment(), Utils.CONST.SERVICE_CATALOG_CLIENT)
            .client;
        return serviceCatalog.then((client) => {
            return client.apis.Services.deleteService({ serviceId: id });
        }).then((response) => response.body);
    }

    /**
     * Export a Service
     *
     * @param name {string} Name of the service.
     * @param version {string} Version of the service.
     * @returns {promise} Service Entry promise.
     */
    static exportService() {
        const serviceCatalog = new APIClientFactory()
            .getAPIClient(Utils.getCurrentEnvironment(), Utils.CONST.SERVICE_CATALOG_CLIENT)
            .client;
        const promisedServices = serviceCatalog.then(() => {
            // return client.apis['Services'].exportService(
            //     {
            //         name: id,
            //         version: version
            //     },
            //     this._requestMetaData()
            // );
            return MockResponses.exportService();
        });
        return promisedServices.then((response) => response.body);
    }

    /**
     * Import a Service
     * @param id {string} UUID of the service.
     * @returns {promise} Service Entry promise.
     */
    static importService() {
        const serviceCatalog = new APIClientFactory()
            .getAPIClient(Utils.getCurrentEnvironment(), Utils.CONST.SERVICE_CATALOG_CLIENT)
            .client;
        const promisedServices = serviceCatalog.then(() => {
            // return client.apis['Services'].importService(
            //     {
            //         serviceId: id,
            //     },
            //     this._requestMetaData()
            // );
            return MockResponses.importService();
        });
        return promisedServices.then((response) => response.body);
    }

    /**
     * Get a service by ID
     * @param id {string} UUID of the service.
     * @returns {promise} Service Entry promise.
     */
    static getServiceById(id) {
        const serviceCatalog = new APIClientFactory()
            .getAPIClient(Utils.getCurrentEnvironment(), Utils.CONST.SERVICE_CATALOG_CLIENT)
            .client;
        const promisedServices = serviceCatalog.then((client) => {
            return client.apis.Services.getServiceById(
                {
                    serviceId: id,
                },
                this._requestMetaData(),
            );
        });
        return promisedServices.then((response) => response.body);
    }

    /**
     * Get a service by Name
     * @param id {string} name of the service.
     * @returns {promise} Service Entry promise.
     */
    static getServiceByName(info) {
        const serviceCatalog = new APIClientFactory()
            .getAPIClient(Utils.getCurrentEnvironment(), Utils.CONST.SERVICE_CATALOG_CLIENT)
            .client;
        const promisedServices = serviceCatalog.then((client) => {
            return client.apis.Services.searchServices(
                {
                    name: info.name,
                },
                this._requestMetaData(),
            );
        });
        return promisedServices.then((response) => response.body);
    }

    /**
     * Get the definition of a service
     * @param id {string} UUID of the service.
     * @returns {promise} Service Entry promise.
     */
    static getServiceDefinition(id) {
        const serviceCatalog = new APIClientFactory()
            .getAPIClient(Utils.getCurrentEnvironment(), Utils.CONST.SERVICE_CATALOG_CLIENT)
            .client;
        const promisedServices = serviceCatalog.then((client) => {
            return client.apis.Services.getServiceDefinition(
                {
                    serviceId: id,
                },
                this._requestMetaData(),
            );
        });
        return promisedServices.then((response) => response.body);
    }

    /**
     * Get the usages of a service
     * @param id {string} UUID of the service.
     * @returns {promise} Service Entry API promise.
     */
    static getAPIUsages(id) {
        const serviceCatalog = new APIClientFactory()
            .getAPIClient(Utils.getCurrentEnvironment(), Utils.CONST.SERVICE_CATALOG_CLIENT)
            .client;
        const promisedServices = serviceCatalog.then((client) => {
            return client.apis.Services.getServiceUsage(
                {
                    serviceId: id,
                },
                this._requestMetaData(),
            );
        });
        return promisedServices.then((response) => response.body);
    }

    /**
     * Update a Service
     * @param body {Object} Service body.
     * @returns {promise} Promise.
     */
    static updateService() {
        const serviceCatalog = new APIClientFactory()
            .getAPIClient(Utils.getCurrentEnvironment(), Utils.CONST.SERVICE_CATALOG_CLIENT)
            .client;
        const promisedService = serviceCatalog.then(() => {
            // return client.apis['Services'].updateService(
            //     {
            //         serviceId: id,
            //         body
            //     },
            //     this._requestMetaData()
            // );
            return MockResponses.updateService();
        });
        return promisedService.then((response) => response.body);
    }
}

export default ServiceCatalog;
