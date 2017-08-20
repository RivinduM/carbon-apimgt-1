/*
 * Copyright (c) 2017, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';

import Loading from '../../Base/Loading/Loading'
import ResourceNotFound from "../../Base/Errors/ResourceNotFound";
import Api from '../../../data/api'
import {Select} from 'antd';

class NavBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            api: null,
            notFound: false,
            applications: [],
            dropDownApplications: [],
            dropDownPolicies: [],
            policies: [],
            index: 0
        };
        this.api_uuid = this.props.match.params.api_uuid;
        this.dropDownApplications =  null;
        this.dropDownPolicies =  [];
        this.policies =  [];
        this.applications = [];
    }
    static get CONST() {
        return {
            OVERVIEW: "overview",
            DOCUMENTATION: "documentation",
            APICONSOLE: "apiConsole",
            FORUM: "forum"
        }
    }

    componentDidMount() {
        const api = new Api();
        let retrieveAPI = null;
        let retrievedApps = null;
        let promised_api = api.getAPIById(this.api_uuid);
        promised_api.then(
            response => {
            retrieveAPI = response.obj;
                this.setState({api: response.obj});
        let promised_applications = api.getAllApplications();
        promised_applications.then(
            response => {
            this.setState({applications: response.obj.list});
            retrievedApps = response.obj.list;

        let promised_subscriptions = api.getSubscriptions(this.api_uuid, null);
        promised_subscriptions.then(
            response => {
            this.dropDownApplications = [<Option key="custom" onClick={this.handleClick} >New Application</Option>];

        for (var i = 0; i < retrieveAPI.policies.length; i++) {
            this.dropDownPolicies.push(<Option key={retrieveAPI.policies[i]}>{retrieveAPI.policies[i]}</Option>);
        }
        var subscription = {};
        var subscriptions = response.obj.list;
        var application = {};
        var subscribedApp = false;
        for (var i = 0; i < retrievedApps.length; i++) {
            subscribedApp = false;
            application = applications[i];
            if (application.lifeCycleStatus != "APPROVED") {
                continue;
            }
            for (var j = 0; j < subscriptions.length; j++) {
                subscription = subscriptions[j];
                if (subscription.applicationId === application.applicationId) {
                    subscribedApp = true;
                    continue;
                }
            }
            if(!subscribedApp) {
                this.dropDownApplications.push(<Option key={application.id}>{application.name}</Option>);
            }
        }
        this.setState({policies: retrieveAPI.policies});
    }).catch(
            error => {
            if (process.env.NODE_ENV !== "production") {
            console.log(error);
        }
        let status = error.status;
        if (status === 404) {
            this.setState({notFound: true});
        }
    });

        }).catch(
                error => {
                if (process.env.NODE_ENV !== "production") {
                console.log(error);
            }
            let status = error.status;
            if (status === 404) {
                this.setState({notFound: true});
            }});
            }
        ).catch(
            error => {
                if (process.env.NODE_ENV !== "production") {
                    console.log(error);
                }
                let status = error.status;
                if (status === 404) {
                    this.setState({notFound: true});
                }
            }
        );
        debugger;
    };

    populateApplicationDropdown(){
        debugger;
        return this.dropDownApplications;
    };

    populatePolicyDropdown(){
        debugger;
        return this.dropDownPolicies;
    };

    handleClick(){
        this.setState({redirect: true});
    };

    handleChange = (event, index) => {
        console.info(event);
        this.setState({ index });
    };

    render() {
        /* TODO: This could have been done easily with match object containing api_uuid value , But
         Due to a bug (https://github.com/ReactTraining/react-router/issues/4649) in the latest version(4.1.1),
         it's not working as expected, Hence doing this hack, revert to following with react-router upgrade
         const api_uuid = this.props.match.params.api_uuid; ~tmkb */
        const pathSegments = this.props.location.pathname.split('/');
        // This assume that last segment and segment before it contains detail page action and API UUID
        const [active_tab, api_uuid] = pathSegments.reverse();
        const api = this.state.api;
        if (this.state.notFound) {
            return <ResourceNotFound/>
        }
        if (!this.state.api) {
            return <Loading/>
        }
        const TabContainer = props =>
            <div style={{ padding: 20 }}>
                {props.children}
            </div>;
        return (
            <div>
                <Grid container>
                    <Grid item xs={12} sm={2}>
                        <Paper><img alt="API thumb" width="100%" src="/store/public/images/api/api-default.png"/></Paper>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <Paper>
                            <List>
                                <ListItem button>
                                    <ListItemText primary={api.name} />
                                </ListItem>
                                <ListItem button>
                                    <ListItemText primary={api.version} />
                                </ListItem>
                                <ListItem button>
                                    <ListItemText primary={api.context} />
                                </ListItem>
                                <ListItem button>
                                    <ListItemText primary={api.createdTime} />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
                 <Select>{this.populateApplicationDropdown()}</Select>
                 <Select>{this.populatePolicyDropdown()}</Select>
                <AppBar position="static">
                    <Tabs index={this.state.index} onChange={this.handleChange}>
                        {Object.entries(NavBar.CONST).map(
                            ([key, val]) => {
                                return (
                                    <Tab label={key} to={"/apis/" + api_uuid + "/" + val} />
                                );
                            }
                        )}

                    </Tabs>
                </AppBar>

                {this.state.index === 0 &&
                <TabContainer>
                    {'Item One'}
                </TabContainer>}
                {this.state.index === 1 &&
                <TabContainer>
                    {'Item Two'}
                </TabContainer>}
                {this.state.index === 2 &&
                <TabContainer>
                    {'Item Three'}
                </TabContainer>}


            <div id={active_tab} >

            </div>
            </div>
        )
    }
}

// Using `withRouter` helper from React-Router-Dom to get the current user location to be used with logout action,
// To identify which tab user is currently viewing we need to know their location information
// DOC: https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md
export default withRouter(NavBar)
