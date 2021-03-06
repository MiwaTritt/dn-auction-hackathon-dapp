import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";

import Layout from "../components/Layout";
import factory from "../ethereum/factory";

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
      };
    });

    return <Card.Group items={campaigns} />;
  }

  render() {
    return (
      <Layout>
        <h3>Open Campaigns</h3>
        <Button
          floated="right"
          content="Create Campaign"
          icon="add circle"
          primary
        />
        {this.renderCampaigns()}
      </Layout>
    );
  }
}

export default CampaignIndex;
