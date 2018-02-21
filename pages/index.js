import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';

import Header from '../components/header'
import factory from '../ethereum/factory';

class CampaignIndex extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();        
        return { campaigns };
    }

    renderCampaigns() {
        const campaigns = this.props.campaigns.map(address => {
            return {
                header: address,
                description: <a>View Campaign</a>,
                fluid: true
            }
        });

        return <Card.Group items={campaigns} />;
    }

    render() {
        return (
            <div>
                <Header/>
                <h1>{ this.renderCampaigns() }</h1>   
            </div>
        );     
    }
}

export default CampaignIndex;
